import { AppstoreOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Avatar, Button, Popover, Spin } from 'antd';
import gsap from 'gsap';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import
{
    BoxGeometry, Color, Mesh, MeshBasicMaterial,
    PerspectiveCamera, Scene, TextureLoader, WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS3DRenderer, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer';
import mustlook from '../../assets/img/mustlook.png';
import '../../assets/scss/VR.scss';
import { HouseInfo, HouseVRInfo } from '../../interfaces/HouseListInterface';
import { CONST_HOST } from '../Common/VariableGlobal';
import { RenderTags } from '../HouseList/HouseItem';
import SwitchRoom from './SwitchRoom';


declare interface VRSceneProps extends RouteComponentProps
{

}

@observer
class VRScene extends Component<VRSceneProps, {}>
{
    VR_Scene = React.createRef<HTMLDivElement>();
    //渲染器
    renderer = new WebGLRenderer(
        { antialias: true }
    );
    //CSS渲染器
    css3DRenderer = new CSS3DRenderer();
    //场景
    scene = new Scene();
    //相机
    camera = new PerspectiveCamera(
        90,                                               //摄像机视锥体垂直视野角度
        document.body.clientWidth / document.body.clientHeight, //摄像机视锥体长宽比
        0.1,                                                    //近截面 小于不渲染
        1000                                                    //远截面 大于不不渲染
    );
    controler = new OrbitControls(this.camera, this.css3DRenderer.domElement || this.renderer.domElement);
    // arrowHelpers = {
    //     arrowHelperX: new ArrowHelper(new Vector3(1, 0, 0), new Vector3(0, 0, 0), 250, "#FF0000"),
    //     arrowHelperY: new ArrowHelper(new Vector3(0, 1, 0), new Vector3(0, 0, 0), 250, "#00FF00"),
    //     arrowHelperZ: new ArrowHelper(new Vector3(0, 0, 1), new Vector3(0, 0, 0), 250, "#0000FF"),
    // };
    @observable currScene: MeshBasicMaterial[] = new Array<MeshBasicMaterial>();
    currPositons: CSS3DSprite[] = new Array<CSS3DSprite>();
    VR_Cube: Mesh = new Mesh(new BoxGeometry(200, 200, 200));
    scene1: MeshBasicMaterial[] = [
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/right_1.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/left_1.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/top_1.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/bottom_1.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/front_1.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/back_1.png`) }),
    ];
    @observable currRoomScenes: string[] = [];
    @observable showSwitchRoom: boolean = false;

    /**
     * @description 初始化场景
     */
    InitThree = () =>
    {
        const { renderer, css3DRenderer, scene, camera, VR_Scene } = this;

        // scene.add(arrowHelpers.arrowHelperX);
        // scene.add(arrowHelpers.arrowHelperY);
        // scene.add(arrowHelpers.arrowHelperZ);

        camera.position.set(0, 0, 5);
        camera.lookAt(scene.position);

        renderer.setClearColor(new Color(1, 1, 1));
        renderer.setSize(document.body.clientWidth, document.body.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.domElement.style.position = 'absolute';
        VR_Scene.current!.appendChild(renderer.domElement);

        css3DRenderer.setSize(document.body.clientWidth, document.body.clientHeight);
        css3DRenderer.domElement.style.position = 'absolute';
        VR_Scene.current!.append(css3DRenderer.domElement);

        this.LoopRender();
    };
    /**
     * @author LeomharT
     * @description 初始化VR的场景
     * @param {string} HouseId 房屋的ID
     * @param {string} SceneId 场景的ID
     */
    InitScene = async (HouseId: string, SceneId: string) =>
    {
        const { scene, VR_Cube, currScene, currPositons } = this;
        let res = await fetch(`${CONST_HOST}/GetHouseVrSceneInfo?HouseId=${HouseId}&SceneId=${SceneId}`);
        const initPositionInfo = await res.json() as HouseVRInfo;
        for (let u of initPositionInfo.urls)
        {
            currScene.push(
                new MeshBasicMaterial({
                    transparent: true,
                    opacity: 1,
                    map: new TextureLoader().load(`${CONST_HOST}/${u.url}`)
                }),
            );
        }

        for (let p of initPositionInfo.positions)
        {
            let el = document.createElement("div");
            el.classList.add('VRNextSceneArrow');
            el.setAttribute("goToScene", p.toSceneId);

            let elInnerText = document.createElement("div");
            elInnerText.classList.add("VRSceneTagName");
            elInnerText.innerText = p.toSceneName;
            el.appendChild(elInnerText);

            el.addEventListener('click', async (e: MouseEvent) =>
            {
                await this.GetSceneAsync(HouseId, el.getAttribute("goToScene") as string);
            });

            let cssObj = new CSS3DSprite(el);
            cssObj.position.setX(parseInt(p.x));
            cssObj.position.setY(parseInt(p.y));
            cssObj.position.setZ(parseInt(p.z));
            currPositons.push(cssObj);
        }

        for (let cp of currPositons)
        {
            scene.add(cp);
        }

        VR_Cube.material = currScene;
        VR_Cube.geometry.scale(1, 1, -1);
        scene.add(VR_Cube);
    };
    /**
     * @description 设置控制器选项
     */
    SetUpControl = () =>
    {
        const { controler } = this;
        controler.enablePan = false;
        controler.enableDamping = true;
        controler.dampingFactor = .2;
        controler.enableZoom = false;
        //反转操作
        controler.rotateSpeed *= -.3;
    };
    /**
     * @description 无限循环执行渲染,每一帧在都执行
     */
    LoopRender = () =>
    {
        const { renderer, css3DRenderer, scene, camera, controler } = this;
        requestAnimationFrame(this.LoopRender);
        css3DRenderer.render(scene, camera);
        renderer.render(scene, camera);
        controler.update();
    };
    /**
     * @description 窗口放大缩小时要重新渲染
     */
    ReSize = () =>
    {
        const { renderer, css3DRenderer, camera } = this;
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        css3DRenderer.setSize(width, height);
    };

    /**
     *
     * @param {string} HouseId
     * @param {string} SceneId
     * @returns {void}
     * @description 通过将自己赋值给循环出来的信息点,达到切换场景的目的
     */
    GetSceneAsync = async (HouseId: string, SceneId: string): Promise<void> =>
    {
        const { scene, camera, VR_Cube, currScene, currPositons } = this;
        let targetScene = new Array<MeshBasicMaterial>();
        let res = await fetch(`${CONST_HOST}/GetHouseVrSceneInfo?HouseId=${HouseId}&SceneId=${SceneId}`);
        const positionInfo = await res.json() as HouseVRInfo;
        for (let u of positionInfo.urls)
        {
            targetScene.push(
                new MeshBasicMaterial({
                    transparent: true,
                    opacity: 0,
                    map: new TextureLoader().load(`${CONST_HOST}/${u.url}`)
                }),
            );
        }

        gsap.to(currScene, .35, { opacity: 0 });
        setTimeout(() =>
        {
            VR_Cube.material = targetScene;
        }, 350);
        setTimeout(() =>
        {
            gsap.to(targetScene, .35, { opacity: 1 });
            camera.position.set(0, 0, 5);
            camera.lookAt(scene.position);
            this.currScene = targetScene;
        }, 400);

        for (let cp of currPositons)
        {
            scene.remove(cp);
        }
        this.currPositons = [];

        for (let p of positionInfo.positions)
        {
            let el = document.createElement("div");
            el.classList.add('VRNextSceneArrow');
            el.setAttribute("goToScene", p.toSceneId);

            let elInnerText = document.createElement("div");
            elInnerText.classList.add("VRSceneTagName");
            elInnerText.innerText = p.toSceneName;
            el.appendChild(elInnerText);

            el.addEventListener('click', async (e: MouseEvent) =>
            {
                await this.GetSceneAsync(HouseId, el.getAttribute("goToScene") as string);
            });

            let cssObj = new CSS3DSprite(el);
            cssObj.position.setX(parseInt(p.x));
            cssObj.position.setY(parseInt(p.y));
            cssObj.position.setZ(parseInt(p.z));
            this.currPositons.push(cssObj);
        }

        if (!this.currPositons.length) return;
        setTimeout(() =>
        {
            scene.add(...this.currPositons);
        }, 500);

    };
    async componentDidMount()
    {
        //@ts-ignore
        const { HouseId } = this.props.match.params;
        window.onresize = () =>
        {
            this.ReSize();
        };
        this.InitThree();
        this.SetUpControl();
        //还需要提前获取当前House下的所有场景ID(嗯这数据结构真的垃圾啊)
        fetch(`${CONST_HOST}/GetHouseVrSceneArray?HouseId=${HouseId}`)
            .then(res => res.json())
            .then(async (data) =>
            {
                if (!data.length) return;
                this.currRoomScenes = data;
                await this.InitScene(HouseId, data[0].sceneId);
            })
            .catch(err =>
            {
                throw new Error(err);
            });
        // let el = document.createElement("div");
        // el.classList.add('VRNextSceneArrow');

        // let elInnerText = document.createElement("div");
        // elInnerText.classList.add("VRSceneTagName");
        // elInnerText.innerText = '客厅';
        // el.appendChild(elInnerText);

        // el.addEventListener('click', async (e: MouseEvent) =>
        // {
        //     await this.GetSceneAsync(HouseId, el.getAttribute("goToScene") as string);
        // });

        // let cssObj = new CSS3DSprite(el);
        // cssObj.position.setX(-350);
        // cssObj.position.setY(0);
        // cssObj.position.setZ(-20);
        // this.scene.add(cssObj);
    }
    render()
    {
        const { currScene } = this;
        const houseInfo = JSON.parse(sessionStorage.getItem('houseInfo') as string) as HouseInfo;
        return (
            <div className="Masking">
                {
                    !currScene.length &&
                    <div className='VRLoadingFrame'>
                        <Spin size='large' />
                    </div>
                }

                <div className='VRHouseInfo'>
                    <Avatar
                        shape='circle'
                        size='large'
                        src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                    />
                    <div>
                        {houseInfo.baseInfo.hTitle}
                        &nbsp;&nbsp;
                        {RenderTags(houseInfo.baseInfo.hTags.split(','))}
                        <img style={{ width: "62px", height: "23px", marginRight: "5px", marginBottom: "3px" }} alt="mustLookLook" src={mustlook} />
                    </div>
                </div>

                <div className='VROptions'>
                    <Button
                        icon={<AppstoreOutlined />}
                        size='large'
                        type='text'
                        style={{ backgroundColor: " rgba(0,0,0,0.3)", color: "white" }}
                        onClick={() =>
                        {
                            this.showSwitchRoom = !this.showSwitchRoom;
                        }}
                    />
                    <Popover
                        trigger='click'
                        content={
                            <img className='QR_Code' alt='QR' src={`https://api.pwmqr.com/qrcode/create/?url=http://192.168.126.102:3000${this.props.location.pathname}`} />
                        }>
                        <Button
                            size='large'
                            type='text'
                            icon={<QrcodeOutlined />}
                            style={{ backgroundColor: " rgba(0,0,0,0.3)", color: "white" }}
                        />
                    </Popover>
                </div>

                <div
                    className="VRScene"
                    ref={this.VR_Scene}
                    onMouseDown={() =>
                    {
                        this.VR_Scene.current!.style.cursor = 'grabbing';
                    }}
                    onMouseUp={() =>
                    {
                        this.VR_Scene.current!.style.cursor = 'grab';
                    }}
                />

                <SwitchRoom
                    showSwitchRoom={this.showSwitchRoom}
                    currRoomScenes={this.currRoomScenes}
                    GetSceneAsync={this.GetSceneAsync}
                />

            </div>
        );
    }
}

export default withRouter(VRScene);

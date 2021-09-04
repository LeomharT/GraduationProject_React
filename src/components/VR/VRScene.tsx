import gsap from 'gsap';
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
import '../../assets/scss/VR.scss';
import { HouseVRInfo } from '../../interfaces/HouseListInterface';
import { CONST_HOST } from '../Common/VariableGlobal';

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
    currScene: MeshBasicMaterial[] = new Array<MeshBasicMaterial>();
    currPositons: CSS3DSprite[] = new Array<CSS3DSprite>();
    scene1: MeshBasicMaterial[] = [
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/right_1.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/left_1.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/top_1.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/bottom_1.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/front_1.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/back_1.png`) }),
    ];
    scene2: MeshBasicMaterial[] = [
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/right_2.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/left_2.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/top_2.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/bottom_2.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/front_2.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/back_2.png`) })
    ];
    scene3: MeshBasicMaterial[] = [
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/right_3.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/left_3.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/top_3.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/bottom_3.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/front_3.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/back_3.png`) })
    ];
    scene4: MeshBasicMaterial[] = [
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/right_4.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/left_4.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/top_4.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/bottom_4.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/front_4.png`) }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load(`${CONST_HOST}/img/HouseVRimg/House_1/back_4.png`) })
    ];
    VR_Cube: Mesh = new Mesh(new BoxGeometry(200, 200, 200));
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
     * @description 添加VR的场景
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
    GetSceneAsync = async (HouseId: string, SceneId: string) =>
    {
        //想想怎么写成纯函数不行这样的那样然后那样ok？
        const { scene, camera, VR_Cube, currScene, currPositons } = this;
        let targetScene = new Array<MeshBasicMaterial>();
        let res = await fetch(`${CONST_HOST}/GetHouseVrSceneInfo?HouseId=${HouseId}&SceneId=${SceneId}`);
        const positionInfo = await res.json() as HouseVRInfo;
        console.log(positionInfo);
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

        gsap.to(currScene, .5, { opacity: 0 });
        setTimeout(() =>
        {
            VR_Cube.material = targetScene;
            gsap.to(targetScene, 1, { opacity: 1 });
            camera.position.set(0, 0, 5);
            camera.lookAt(scene.position);
            this.currScene = targetScene;
        }, 300);

        for (let cp of currPositons)
        {
            console.log(cp);
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
        }, 700);



        // for (let p of positionInfo.positions)
        // {
        //     let el = document.createElement('div');
        //     el.classList.add('VRNextSceneArrow');
        //     el.setAttribute('goToScene', p.toSceneId);
        //     let elinnerTxt = document.createElement("div");
        //     elinnerTxt.classList.add('VRSceneTagName');
        //     elinnerTxt.innerText = p.toSceneName;
        //     el.appendChild(elinnerTxt);
        //     el.addEventListener('click', async (e: MouseEvent) =>
        //     {
        //         let targetScene = new Array<MeshBasicMaterial>();
        //         let res = await fetch(`${CONST_HOST}/GetHouseVrSceneInfo?HouseId=${HouseId}&SceneId=${el.getAttribute("goToScene")}`);
        //         let targetPositionInfo = await res.json() as HouseVRInfo;
        //         gsap.to(currScene, .5, { opacity: 0 });
        //         for (let u_t of targetPositionInfo.urls)
        //         {
        //             targetScene.push(
        //                 new MeshBasicMaterial({
        //                     transparent: true,
        //                     opacity: 0,
        //                     map: new TextureLoader().load(`${CONST_HOST}/${u_t.url}`)
        //                 })
        //             );
        //         }
        //         setTimeout(() =>
        //         {
        //             VR_Cube.material = targetScene;
        //             gsap.to(targetScene, 1, { opacity: 1 });
        //             camera.position.set(0, 0, 5);
        //             camera.lookAt(scene.position);
        //         }, 300);
        //     });

        //     const cssObj = new CSS3DSprite(el);
        //     cssObj.position.setX(parseInt(p.x));
        //     cssObj.position.setY(parseInt(p.y));
        //     cssObj.position.setZ(parseInt(p.z));

        //     scene.add(cssObj);
        // }



        // let element = document.createElement('div');
        // element.classList.add('VRNextSceneArrow');
        // let innerTextel = document.createElement("div");
        // innerTextel.innerText = '卧室';
        // innerTextel.classList.add("VRSceneTagName");
        // element.appendChild(innerTextel);
        // element.setAttribute("goToScene", '8');
        // //先获取当前是在那个场景,暂存起来然后跳转过去在吧暂存的场景opasiti改掉
        // element.onclick = () =>
        // {
        //     console.log(`我去那个场景了:${element.getAttribute("goToScene")}`);
        //     const { scene1, scene4 } = this;

        //     if (VR_Cube.material === scene1)
        //     {
        //         gsap.to(scene1, .5, { opacity: 0 });
        //         setTimeout(() =>
        //         {
        //             VR_Cube.material = scene4;
        //             gsap.to(scene4, 1, { opacity: 1 });
        //             camera.position.set(0, 0, 5);
        //             camera.lookAt(scene.position);
        //         }, 300);

        //         return;
        //     }
        //     if (VR_Cube.material === scene4)
        //     {
        //         gsap.to(scene4, .5, { opacity: 0 });
        //         setTimeout(() =>
        //         {
        //             VR_Cube.material = scene1;
        //             gsap.to(scene1, 1, { opacity: 1 });
        //             camera.position.set(0, 0, 5);
        //             camera.lookAt(scene.position);
        //         }, 300);

        //         return;
        //     }
        // };

        // let elements = document.createElement("div");
        // elements.classList.add('VRNextSceneArrow');
        // let innerTexts = document.createElement("div");
        // innerTexts.classList.add('VRSceneTagName');
        // innerTexts.innerText = "餐厅";
        // elements.appendChild(innerTexts);

        // let object = new CSS3DSprite(element);
        // let objects = new CSS3DSprite(elements);
        // object.position.x = -190;
        // object.position.y = 0;
        // object.position.z = -500;

        // objects.position.x = -70;
        // objects.position.y = -20;
        // objects.position.z = -500;
        // // object.lookAt(camera.position);
        // scene.add(object);
        // scene.add(objects);
    };
    async componentDidMount()
    {
        //@ts-ignore
        const { HouseId } = this.props.match.params;
        window.onresize = () =>
        {
            this.ReSize();
        };
        this.VR_Scene.current!.onmousedown = (e: MouseEvent) =>
        {
            this.VR_Scene.current!.style.cursor = 'move';
        };
        this.VR_Scene.current!.onmouseup = (e: MouseEvent) =>
        {
            this.VR_Scene.current!.style.cursor = 'default';
        };
        this.InitThree();
        this.SetUpControl();
        //还需要提前获取当前House下的所有场景ID(嗯这数据结构真的垃圾啊)
        fetch(`${CONST_HOST}/GetHouseVrSceneArray?HouseId=${HouseId}`)
            .then(res => res.json())
            .then(async (data) =>
            {
                await this.InitScene(HouseId, data[0].sceneId);
                // await this.GetSceneAsync(HouseId, data[0].sceneId);
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
        // cssObj.position.setX(400);
        // cssObj.position.setY(0);
        // cssObj.position.setZ(20);
        // this.scene.add(cssObj);
    }
    render()
    {
        return (
            <div className="Masking">
                <div
                    className="VRScene"
                    ref={this.VR_Scene}
                />
            </div >
        );
    }
}

export default withRouter(VRScene);

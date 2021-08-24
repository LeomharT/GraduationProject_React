import { Button } from 'antd';
import gsap from 'gsap';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import
{
    BoxGeometry, Color, Mesh, MeshBasicMaterial,
    PerspectiveCamera, Scene, TextureLoader, WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import '../../assets/scss/VR.scss';


@observer
export default class VRScene extends Component<{}, {}>
{
    VR_Scene = React.createRef<HTMLDivElement>();
    //渲染器
    renderer = new WebGLRenderer(
        { antialias: true }
    );
    //场景
    scene = new Scene();
    //相机
    camera = new PerspectiveCamera(
        90,                                               //摄像机视锥体垂直视野角度
        document.body.clientWidth / document.body.clientHeight, //摄像机视锥体长宽比
        0.1,                                                    //近截面 小于不渲染
        1000                                                    //远截面 大于不不渲染
    );
    controler = new OrbitControls(this.camera, this.renderer.domElement);
    // arrowHelpers = {
    //     arrowHelperX: new ArrowHelper(new Vector3(1, 0, 0), new Vector3(0, 0, 0), 250, "#FF0000"),
    //     arrowHelperY: new ArrowHelper(new Vector3(0, 1, 0), new Vector3(0, 0, 0), 250, "#00FF00"),
    //     arrowHelperZ: new ArrowHelper(new Vector3(0, 0, 1), new Vector3(0, 0, 0), 250, "#0000FF"),
    // };
    scene1: MeshBasicMaterial[] = [
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load('http://localhost:3065/img/HouseVRimg/House_00/right.png') }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load('http://localhost:3065/img/HouseVRimg/House_00/left.png') }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load('http://localhost:3065/img/HouseVRimg/House_00/top.png') }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load('http://localhost:3065/img/HouseVRimg/House_00/bottom.png') }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load('http://localhost:3065/img/HouseVRimg/House_00/front.png') }),
        new MeshBasicMaterial({ transparent: true, opacity: 1, map: new TextureLoader().load('http://localhost:3065/img/HouseVRimg/House_00/back.png') })
    ];
    scene2: MeshBasicMaterial[] = [
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load('http://localhost:3065/img/HouseVRimg/House_00/right_2.png') }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load('http://localhost:3065/img/HouseVRimg/House_00/left_2.png') }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load('http://localhost:3065/img/HouseVRimg/House_00/top_2.png') }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load('http://localhost:3065/img/HouseVRimg/House_00/bottom_2.png') }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load('http://localhost:3065/img/HouseVRimg/House_00/front_2.png') }),
        new MeshBasicMaterial({ transparent: true, opacity: 0, map: new TextureLoader().load('http://localhost:3065/img/HouseVRimg/House_00/back_2.png') })
    ];
    VR_Cube = new Mesh(
        new BoxGeometry(200, 200, 200),
        this.scene1
    );

    /**
     * @description 初始化场景
     */
    InitThree = () =>
    {
        const { renderer, scene, camera, VR_Scene } = this;

        // scene.add(arrowHelpers.arrowHelperX);
        // scene.add(arrowHelpers.arrowHelperY);
        // scene.add(arrowHelpers.arrowHelperZ);

        camera.position.set(0, 0, 5);
        camera.lookAt(scene.position);

        renderer.setClearColor(new Color('#FFFFFF'));
        renderer.setSize(document.body.clientWidth, document.body.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        VR_Scene.current!.appendChild(renderer.domElement);

        this.LoopRender();
    };

    /**
     * @description 添加VR的场景
     */
    AddVrBoxIntoScene = () =>
    {
        const { scene, VR_Cube } = this;

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
        const { renderer, scene, camera, controler } = this;
        requestAnimationFrame(this.LoopRender);
        renderer.render(scene, camera);
        controler.update();
    };

    /**
     * @description 窗口放大缩小时要重新渲染
     */
    ReSize = () =>
    {
        const { renderer, camera } = this;
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    };
    componentDidMount()
    {
        window.onresize = () =>
        {
            this.ReSize();
        };
        this.VR_Scene.current!.onmousedown = (e: MouseEvent) =>
        {
            ((e.target) as HTMLCanvasElement).style.cursor = 'move';
        };
        this.VR_Scene.current!.onmouseup = (e: MouseEvent) =>
        {
            ((e.target) as HTMLCanvasElement).style.cursor = 'default';
        };
        this.InitThree();
        this.SetUpControl();
        this.AddVrBoxIntoScene();
    }
    render()
    {
        return (
            <div className="Masking">
                <div
                    className="VRScene"
                    ref={this.VR_Scene} />
                <Button
                    onClick={() =>
                    {
                        const { VR_Cube, camera, scene, scene1, scene2 } = this;

                        if (VR_Cube.material === this.scene1)
                        {
                            gsap.to(scene1, .5, { opacity: 0 });
                            setTimeout(() =>
                            {
                                VR_Cube.material = this.scene2;
                                gsap.to(scene2, 1, { opacity: 1 });
                                camera.position.set(0, 0, 5);
                                camera.lookAt(scene.position);
                            }, 300);

                            return;
                        }
                        if (VR_Cube.material === this.scene2)
                        {
                            gsap.to(scene2, .5, { opacity: 0 });
                            setTimeout(() =>
                            {
                                VR_Cube.material = this.scene1;
                                gsap.to(scene1, 1, { opacity: 1 });
                                camera.position.set(0, 0, 5);
                                camera.lookAt(scene.position);
                            }, 300);

                            return;
                        }
                    }}
                    style={{ position: "absolute", top: "200px", left: "50%" }}
                >
                    转场</Button>
            </div >
        );
    }
}

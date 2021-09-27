import gsap from 'gsap';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, RefObject } from 'react';
import open_peeps from '../../assets/img/open-peeps-sheet-colorful.png';


@observer
export default class CommunityCrowd extends Component<{}, {}>
{
    @observable canvasRef: RefObject<HTMLCanvasElement> = React.createRef<HTMLCanvasElement>();
    ctx: CanvasRenderingContext2D;
    config = {
        src: open_peeps,
        rows: 15,
        cols: 7
    };
    @observable img = new Image();
    @observable allPeeps: any[] = [];
    @observable availablePeeps: any[] = [];
    @observable stage = { width: 0, height: 0 };
    crowd: any[] = [];

    private RandomRange = (min: number, max: number) => min + Math.random() * (max - min);
    private RandomIndex = (array: any[]) => this.RandomRange(0, array.length) | 0;
    private RemoveFromArray = (array: any[], item: any) => array.splice(item, 1)[0];
    private RemoveItemFromArray = (array: any[], item: any) => this.RemoveFromArray(array, array.indexOf(item));
    private RemoveRandomFromArray = (array: any[]) => this.RemoveFromArray(array, this.RandomIndex(array));
    private GetRandomFromArray = (array: any[]) => (array[this.RandomIndex(array) | 0]);
    ResetPeeps = ({ stage, peep }: any) =>
    {
        const direction = Math.random() > 0.5 ? 1 : -1;
        // using an ease function to skew random to lower values to help hide that peeps have no legs
        const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random());
        const startY = stage?.height - peep?.height + offsetY;
        let startX;
        let endX;

        if (direction === 1)
        {
            startX = -peep?.width;
            endX = stage.width;
            if (peep?.scaleX)
                peep.scaleX = 1;
        } else
        {
            startX = stage?.width + peep?.width;
            endX = 0;
            peep.scaleX = -1;
        }

        peep.x = startX;
        peep.y = startY;
        peep.anchorY = startY;

        return {
            startX,
            startY,
            endX
        };
    };
    NormalWalk = ({ peep, props }: any) =>
    {
        const {
            startY,
            endX
        } = props;

        const xDuration = 10;
        const yDuration = 0.25;

        const tl = gsap.timeline();
        tl.timeScale(this.RandomRange(0.5, 1.5));
        tl.to(peep, {
            duration: xDuration,
            x: endX,
            ease: 'none'
        }, 0);
        tl.to(peep, {
            duration: yDuration,
            repeat: xDuration / yDuration,
            yoyo: true,
            y: startY - 10
        }, 0);
        return tl;
    };
    @observable walks: any = [
        this.NormalWalk,
    ];
    CreatePeep = () =>
    {
        const { rows, cols } = this.config;
        const {
            naturalWidth: width,
            naturalHeight: height
        } = this.img;
        const total = rows * cols;
        const rectWidth = width / rows;
        const rectHeight = height / cols;

        for (let i = 0; i < total; i++)
        {
            this.allPeeps.push(new Peep({
                image: this.img,
                rect: [
                    (i % rows) * rectWidth,
                    (i / rows | 0) * rectHeight,
                    rectWidth,
                    rectHeight,
                ]
            }));
        }
    };
    Resize = () =>
    {
        this.stage.width = this.canvasRef.current!.clientWidth;
        this.stage.height = this.canvasRef.current!.clientHeight;
        this.canvasRef.current!.width = this.stage.width * devicePixelRatio;
        this.canvasRef.current!.height = this.stage.height * devicePixelRatio;

        this.crowd.forEach((peep) =>
        {
            peep.walk.kill();
        });

        this.crowd.length = 0;
        this.availablePeeps.length = 0;
        this.availablePeeps.push(...this.allPeeps);

        this.InitCrowd();
    };
    InitCrowd = () =>
    {
        while (this.availablePeeps.length)
        {
            // setting random tween progress spreads the peeps out
            this.AddPeepToCrowd().walk.progress(Math.random());
        }
    };
    AddPeepToCrowd = () =>
    {
        const { stage } = this;
        const peep = this.RemoveRandomFromArray(this.availablePeeps);
        const walk = this.GetRandomFromArray(this.walks)({
            peep,
            props: this.ResetPeeps({
                peep,
                stage,
            })
        }).eventCallback('onComplete', () =>
        {
            this.RemovePeepFromCrowd(peep);
            this.AddPeepToCrowd();
        });

        peep.walk = walk;

        this.crowd.push(peep);
        this.crowd.sort((a, b) => a.anchorY - b.anchorY);

        return peep;
    };
    RemovePeepFromCrowd = (peep: any) =>
    {
        this.RemoveItemFromArray(this.crowd, peep);
        this.availablePeeps.push(peep);
    };
    @action
    Renderer = () =>
    {
        if (this.canvasRef.current)
            this.canvasRef.current!.width = this.canvasRef.current!.width;
        this.ctx!.save();
        this.ctx!.scale(devicePixelRatio, devicePixelRatio);

        this.crowd.forEach((peep) =>
        {
            peep.render(this.ctx);
        });
        this.ctx!.restore();
    };
    Init = () =>
    {
        this.CreatePeep();
        this.Resize();
        gsap.ticker.add(this.Renderer);
        window.onresize = this.Resize;
    };
    Main = () =>
    {
        this.img.onload = this.Init;
        this.img.src = this.config.src;
        this.ctx = this.canvasRef.current!.getContext('2d') as CanvasRenderingContext2D;
    };
    componentDidMount()
    {
        this.Main();
    }
    componentWillUnmount()
    {
        window.onresize = null;
    }
    render()
    {
        return (
            <canvas className='Crowd' ref={this.canvasRef} />
        );
    }
}



class Peep
{
    constructor({ image, rect }: any)
    {
        this.image = image;
        this.rect = rect;
        this.setRect(rect);
    }
    @observable image: any;
    @observable rect: any;
    @observable x: number = 0;
    @observable y: number = 0;
    @observable width: number;
    @observable height: number;
    @observable anchorY: number = 0;
    @observable scaleX: number = 1;
    @observable walk = null;
    @observable drawArgs: any[] = [];
    setRect = (rect: any) =>
    {
        this.rect = rect;
        this.width = rect[2];
        this.height = rect[3];
        this.drawArgs = [
            this.image,
            ...rect,
            0, 0, this.width, this.height
        ];
    };
    render(ctx: any)
    {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scaleX, 1);
        ctx.drawImage(...this.drawArgs);
        ctx.restore();
    }
}

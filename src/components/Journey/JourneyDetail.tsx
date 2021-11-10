import { CloseOutlined, CopyOutlined, EnvironmentOutlined, ExclamationCircleOutlined, FileTextOutlined, PlusCircleOutlined, PrinterOutlined, ProfileOutlined, QuestionCircleOutlined, ReconciliationOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Carousel, Divider, message } from 'antd';
import jsPDF from 'jspdf';
import moment from 'moment';
import React, { Component, createRef, RefObject } from 'react';
import ReactDOM from 'react-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import { HouseCarousel, HouseInfo } from '../../interfaces/HouseListInterface';
import { UserRentListItem } from '../../interfaces/UserInferface';
import HeadNavigate from '../Common/HeadNavigate';
import { CONST_HOST } from '../Common/VariableGlobal';

class JourneyDetail extends Component<RouteComponentProps, {}>
{
    tMapRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    state: { rInfo: UserRentListItem, hInfo: HouseInfo; } = this.props.location.state as { rInfo: UserRentListItem, hInfo: HouseInfo; };
    map: any;
    pngMarker: any;
    InitMap = () =>
    {
        this.map = new TMap.Map(this.tMapRef.current, {
            center: new TMap.LatLng(
                parseFloat(this.state.hInfo.detailInfo.hLatitude),
                parseFloat(this.state.hInfo.detailInfo.hLongitude)),
            zoom: 15,
            pitch: 43.5,
            rotation: 45,
            viewMode: "2D"
        });
        const { map } = this;
        this.pngMarker = this.AddMapMarks(map);
        const infoWindow = this.AddInfoWindow(map);
        this.AddLabelInfo(map, this.state.rInfo);

        this.pngMarker.add({
            id: "1",
            styleId: "marker",
            position: new TMap.LatLng(
                parseFloat(this.state.hInfo.detailInfo.hLatitude),
                parseFloat(this.state.hInfo.detailInfo.hLongitude)),
            properties: {
                title: "position01"
            }
        });

        this.pngMarker.addListener('click', async (e: any) =>
        {
            map.easeTo({ center: new TMap.LatLng(e.geometry.position.lat, e.geometry.position.lng) });
            const houseInfo: HouseInfo = this.state.hInfo;
            infoWindow.open();
            infoWindow.setPosition(e.geometry.position);
            infoWindow.setContent(`
                <div class = 'MapInfoWindow' id = 'MapInfoWindow'>
                </div>
            `);
            const iw = document.querySelector("#MapInfoWindow") as HTMLDivElement;
            const iwChild = (
                <>
                    <Carousel autoplay>
                        {houseInfo.carousel.map((c: HouseCarousel) =>
                        {
                            return (
                                <img key={c.id} alt={c.id} src={`${CONST_HOST}/${c.url}`} />
                            );
                        })}
                    </Carousel>
                    <div className='iwInfo'>
                        {houseInfo.baseInfo.hTitle}·{houseInfo.baseInfo.hLayout}
                    </div>
                    <div className='iwInfo'>
                        {houseInfo.baseInfo.hRegion}-{houseInfo.baseInfo.hMethod}-{houseInfo.baseInfo.hFloor}-{houseInfo.detailInfo.Area}
                    </div>
                    <div className='iwInfo'>
                        &yen;{houseInfo.baseInfo.hRent}元/月
                    </div>
                    <Button
                        type='link'
                        icon={<ProfileOutlined />}
                        onClick={() =>
                        {
                            this.props.history.push(`/HouseList/DetailInfo/${houseInfo.detailInfo.hId}`);
                        }}
                    >
                        查看详情
                    </Button>
                </>
            );
            ReactDOM.render(iwChild, iw);
        });
    };
    //@ts-ignore
    AddMapMarks = (map: TMap) =>
    {
        const markers = new TMap.MultiMarker({
            map,
            styles: {
                "startMark": new TMap.MarkerStyle({
                    "width": 25,
                    "height": 35,
                    "anchor": { x: 16, y: 32 },
                    "src": 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/start.png'
                }),
            },
        });
        return markers;
    };
    //@ts-ignore
    AddInfoWindow = (map: TMap) =>
    {
        const infoWindow = new TMap.InfoWindow({
            map,
            position: new TMap.LatLng(26.081982, 119.296987),
            offset: { x: 0, y: -32 }
        });
        infoWindow.close();
        return infoWindow;
    };
    //@ts-ignore
    AddLabelInfo = (map: TMapm, rentInfo: UserRentListItem) =>
    {
        new TMap.MultiLabel({
            map,
            styles: {
                'label': new TMap.LabelStyle({
                    'color': '#2B2B2B',
                    'size': 20,
                    'offset': { x: 0, y: 5 },
                    'angle': 0,
                    'alignment': 'center',
                    'verticalAlignment': 'middle'
                }),
                'info': new TMap.LabelStyle({
                    'color': '#7D7D7D',
                    'size': 16,
                    'offset': { x: 0, y: 25 },
                    'angle': 0,
                    'alignment': 'center',
                    'verticalAlignment': 'middle',
                    'width': 10
                })
            },
            geometries: [{
                'id': 'label',
                'styleId': 'label',
                'position': new TMap.LatLng(
                    parseFloat(this.state.hInfo.detailInfo.hLatitude),
                    parseFloat(this.state.hInfo.detailInfo.hLongitude)),
                'content': '您的房源',

            }, {
                'id': 'infolabel',
                'styleId': 'info',
                'position': new TMap.LatLng(
                    parseFloat(this.state.hInfo.detailInfo.hLatitude),
                    parseFloat(this.state.hInfo.detailInfo.hLongitude)),
                'content': moment(rentInfo.checkInDate).format("YYYY年MM月DD日") + '-' + moment(rentInfo.checkOutDate).format("YYYY年MM月DD日"),
            }]
        });
    };
    MakeJourneyRoute = async (start: string) =>
    {
        let url = 'https://apis.map.qq.com/ws/direction/v1/driving/';
        url += `?from=${start}`;
        url += `&to=${this.state.hInfo.detailInfo.hLatitude},${this.state.hInfo.detailInfo.hLongitude}`;  //终点坐标
        url += "&output=jsonp&callback=DrawLine";	//指定JSONP回调函数名，本例为cb
        url += "&key=JFABZ-OLL6V-LFTPW-UAAMN-U6WY6-PIB2B";

        const fun = `
            function DrawLine(ret)
            {
                const coords = ret.result.routes[0].polyline;
                const result = [];
                const kr = 1000000;
                for(let i = 2; i < coords.length; i++)
                {
                    coords[i] = Number(coords[i - 2]) + Number(coords[i]) / kr;
                }
                for (let i = 0; i < coords.length; i += 2) {
                    result.push(new TMap.LatLng(coords[i], coords[i+1]));
                }
                window.RouteResult = result;
            }
        `;
        const scriptfn = document.createElement("script");
        scriptfn.innerText = fun;
        document.body.appendChild(scriptfn);

        const script = document.createElement("script");
        script.src = url;
        document.body.appendChild(script);

        message.loading({ content: "正在为您规划路线", key: 'makeRoute' });

        setTimeout(() =>
        {
            //@ts-ignore
            console.log(window.RouteResult);
            new TMap.MultiPolyline({
                id: 'polyline-layer',
                map: this.map,
                styles: {
                    'style_blue': new TMap.PolylineStyle({
                        'color': '#3777FF',
                        'width': 8,
                        'borderWidth': 5,
                        'borderColor': '#FFF',
                        'lineCap': 'round',
                    })
                },
                //折线数据定义
                geometries: [
                    {
                        'id': 'pl_1',//折线唯一标识，删除时使用
                        'styleId': 'style_blue',//绑定样式名
                        //@ts-ignore
                        'paths': window.RouteResult
                    }
                ]
            });
            message.success({ content: "规划成功", key: 'makeRoute', duration: 2 });
            document.body.removeChild(scriptfn);
            document.body.removeChild(script);
            this.map.easeTo({
                center: new TMap.LatLng(
                    parseFloat(start.split(",")[0]),
                    parseFloat(start.split(",")[1]))
            });
        }, 2000);

    };
    MarkStart = (start: string) =>
    {
        this.pngMarker.add([
            {
                id: "startPoint",
                styleId: 'startMark',
                position: new TMap.LatLng(
                    parseFloat(start.split(",")[0]),
                    parseFloat(start.split(",")[1])),
                properties: {
                    title: "startPoint"
                }
            },]
        );
    };
    componentDidMount()
    {
        this.InitMap();
    }
    render()
    {
        const { rInfo: rentInfo, hInfo } = this.state;
        return (
            <div className='JourneyDetail'>
                <HeadNavigate />
                <div className='JourneyDetailContentWrapper' >
                    <div className='JourneyDetailInfo'>
                        <div>
                            <div className='JourneyDetailInfoTitle'>
                                <Button type='link' size='large' icon={<CloseOutlined />} />
                                <span>您的房源预定</span>
                            </div>
                            <Divider />
                            <h2>{moment(rentInfo.checkInDate).format("YYYY年MM月DD日") + '-' + moment(rentInfo.checkOutDate).format("YYYY年MM月DD日")}</h2>
                            <h1>您入住了{hInfo.baseInfo.hTitle}</h1>
                            <Divider />
                            <div className='JourneyDetailInfoCarousel'>
                                <Carousel autoplay>
                                    {hInfo.carousel.map((c: HouseCarousel) =>
                                    {
                                        return (
                                            <img key={c.id} alt={c.id} src={`${CONST_HOST}/${c.url}`} />
                                        );
                                    })}
                                </Carousel>
                            </div>
                            <p style={{ fontWeight: "bold", fontSize: "25px", margin: "15px 0" }}>
                                {hInfo.baseInfo.hTitle}/{hInfo.baseInfo.hMethod}/{hInfo.baseInfo.hFeature}
                            </p>
                            <div className='JourneyChekeInOut'>
                                <div>
                                    <h2>入住</h2>
                                    {moment(rentInfo.checkInDate).format("YYYY年MM月DD日 hh:mm")}
                                </div>
                                <Divider type='vertical' />
                                <div>
                                    <h2>退房</h2>
                                    {moment(rentInfo.checkOutDate).format("YYYY年MM月DD日 hh:mm")}
                                </div>
                            </div>
                            <Divider />
                            <div className='JourneyInfoItem'>
                                <h1>订单详情</h1>
                                <div className='Options'>
                                    <div>
                                        <div>
                                            <PrinterOutlined />打印详情
                                        </div>
                                        <Button type='text' icon={<RightOutlined />} onClick={() =>
                                        {
                                            const jspdfObj = new jsPDF();
                                            jspdfObj.text(JSON.stringify(rentInfo).split(','), 10, 10);
                                            jspdfObj.save(`${new Date().toLocaleString('chinese', { hour12: false })}`);
                                        }} />
                                    </div>
                                    <div>
                                        <div>
                                            <FileTextOutlined />获取收据
                                        </div>
                                        <Button type='text' icon={<RightOutlined />} />
                                    </div>
                                </div>
                            </div>
                            <Divider />
                            <div className='JourneyInfoItem'>
                                <h1>如何前往</h1>
                                <div className='InfoEtc'>
                                    <h2>地址</h2>
                                    福建省福州市{hInfo.baseInfo.hRegion}
                                </div>
                                <div className='Options'>
                                    <div>
                                        <div>
                                            <CopyOutlined />复制地址
                                        </div>
                                        <Button type='text' icon={<RightOutlined />} onClick={async () =>
                                        {
                                            const clipboardObj = navigator.clipboard;
                                            await clipboardObj.writeText(`福建省福州市${hInfo.baseInfo.hRegion}`);
                                            message.success("复制成功");
                                        }} />
                                    </div>
                                    <div>
                                        <div>
                                            <EnvironmentOutlined />查看路线
                                        </div>
                                        <Button type='text' icon={<RightOutlined />} onClick={() =>
                                        {
                                            const userLocation = navigator.geolocation;
                                            userLocation.getCurrentPosition(async (e) =>
                                            {
                                                console.log("我获取了你的位置");
                                                console.log(e.coords.latitude);
                                                await this.MakeJourneyRoute(e.coords.latitude + ',' + e.coords.longitude);
                                                this.MarkStart(e.coords.latitude + ',' + e.coords.longitude);
                                            }, (err) =>
                                            {
                                                console.log(err);
                                            });
                                        }} />
                                    </div>
                                </div>
                            </div>
                            <Divider />
                            <div className='JourneyInfoItem'>
                                <h1>您的住宿</h1>
                                <div className='InfoEtc'>
                                    <h2>房屋使用指南</h2>
                                    智能刷卡门锁，房屋有安全锁扣，房屋内插卡取电，内置设施齐全，一房一宽带。
                                </div>
                                <div className='Options'>
                                    <div>
                                        <div>
                                            <ProfileOutlined />显示房源
                                        </div>
                                        <Button type='text' icon={<RightOutlined />}
                                            onClick={() =>
                                            {
                                                this.props.history.push(`/HouseList/DetailInfo/${hInfo.detailInfo.hId}`);

                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Divider />
                            <div className='JourneyInfoItem'>
                                <h1>付款信息</h1>
                                <div className='InfoEtc'>
                                    <h2>总费用</h2>
                                    &yen;{rentInfo.totalAmount}
                                </div>
                                <div className='Options'>
                                    <div>
                                        <div>
                                            <PlusCircleOutlined />备注您本次旅程的详细信息
                                        </div>
                                        <Button type='text' icon={<RightOutlined />} />
                                    </div>
                                    <div>
                                        <div>
                                            <ReconciliationOutlined />获取收据
                                        </div>
                                        <Button type='text' icon={<RightOutlined />} />
                                    </div>
                                </div>
                            </div>
                            <Divider />
                            <div className='JourneyInfoItem'>
                                <h1>用户支持</h1>
                                <div className='Options'>
                                    <div>
                                        <div>
                                            <QuestionCircleOutlined />帮助中心
                                        </div>
                                        <Button type='text' icon={<RightOutlined />} />
                                    </div>
                                    <div>
                                        <div>
                                            <ExclamationCircleOutlined />调解中心
                                        </div>
                                        <Button type='text' icon={<RightOutlined />} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ref={this.tMapRef} />
                </div>
            </div>
        );
    }
}


export default withRouter(JourneyDetail);

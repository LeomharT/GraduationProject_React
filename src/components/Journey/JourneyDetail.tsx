import { CloseOutlined, CopyOutlined, EnvironmentOutlined, ExclamationCircleOutlined, FileTextOutlined, PlusCircleOutlined, PrinterOutlined, ProfileOutlined, QuestionCircleOutlined, ReconciliationOutlined, RightOutlined } from '@ant-design/icons';
import { Badge, Button, Carousel, Divider, message } from 'antd';
import jsPDF from 'jspdf';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component, createRef, RefObject } from 'react';
import ReactDOM from 'react-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import { HouseCarousel, HouseInfo } from '../../interfaces/HouseListInterface';
import { UserRentListItem } from '../../interfaces/UserInferface';
import UserStore from '../../redux/UserStore';
import MapUtil from '../../util/MapUtil';
import HeadNavigate from '../Common/HeadNavigate';
import { CONST_HOST } from '../Common/VariableGlobal';

@observer
class JourneyDetail extends Component<RouteComponentProps, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    MapUtil: MapUtil = MapUtil.GetInstance();
    tMapRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    state: { rInfo: UserRentListItem, hInfo: HouseInfo; } = this.props.location.state as { rInfo: UserRentListItem, hInfo: HouseInfo; };
    map: any;
    pngMarker: any;
    @observable isRefunded: boolean = false;
    SetUpTMap = (): void =>
    {
        const { MapUtil, tMapRef } = this;
        this.map = MapUtil.InitMap(tMapRef, this.state.hInfo);
        this.pngMarker = MapUtil.InitMarkers(this.map);
        const infoWindow = MapUtil.InitInfoWindow(this.map);
        this.pngMarker.add([
            {
                id: "1",
                styleId: "marker",
                position: new TMap.LatLng(
                    parseFloat(this.state.hInfo.detailInfo.hLatitude),
                    parseFloat(this.state.hInfo.detailInfo.hLongitude)),
                properties: {
                    title: "position01"
                }
            }
        ]);
        this.pngMarker.addListener('click', async (e: any) =>
        {
            this.map.easeTo({ center: new TMap.LatLng(e.geometry.position.lat, e.geometry.position.lng) });
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
        MapUtil.AddLabelInfo(this.map, this.state.rInfo, this.state.hInfo);
    };
    QueryOrderState = async (): Promise<void> =>
    {
        const res = await (await (fetch(`${CONST_HOST}/QueryOrderRefund`, {
            method: "POST",
            body: JSON.stringify(this.state.rInfo),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            }
        }))).text();
        const orderState = await (await (fetch(res))).json();
        if (orderState.alipay_trade_fastpay_refund_query_response.code === '10000' && orderState.alipay_trade_fastpay_refund_query_response.trade_no)
        {
            this.isRefunded = true;
        }
    };
    ExportOrderDetialAsPDF = (rentInfo: UserRentListItem) =>
    {
        const jspdf = new jsPDF();
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = 800;
        canvas.height = 800;
        canvas.style.width = "400px";
        canvas.style.height = "400px";
        const ctx = canvas.getContext('2d');
        ctx!.font = "40px bold 黑体";
        ctx!.fillStyle = "black";
        ctx!.textAlign = "left";
        ctx!.textBaseline = "middle";
        ctx!.fillText(`订单编号:${rentInfo.trade_no}`, 0, 50);
        ctx!.fillText(`用户昵称:${this.UserStore.RenderUserName()}`, 0, 100);
        ctx!.fillText(`订单金额:${rentInfo.totalAmount}元`, 0, 150);
        ctx!.fillText(`支付时间:${moment(rentInfo.sendPayDate).format("YYYY年MM月DD日 hh:mm:ss")}`, 0, 200);
        ctx!.fillText(`入住时间:${moment(rentInfo.checkInDate).format("YYYY年MM月DD日 hh:mm:ss")}元`, 0, 250);
        ctx!.fillText(`退租时间:${moment(rentInfo.checkOutDate).format("YYYY年MM月DD日 hh:mm:ss")}元`, 0, 300);
        jspdf.addImage(canvas.toDataURL(), 'JPEG', 0, 0, 100, 100);
        jspdf.save(`${new Date().toLocaleString('chinese', { hour12: false })}`);
    };
    componentDidMount()
    {
        this.SetUpTMap();
        this.QueryOrderState();
        console.log(this.state.rInfo.trade_no);
    }
    render()
    {
        const { MapUtil } = this;
        const { rInfo: rentInfo, hInfo } = this.state;
        return (
            <div className='JourneyDetail'>
                <HeadNavigate />
                <div className='JourneyDetailContentWrapper' >
                    <div className='JourneyDetailInfo'>
                        <div>
                            <div className='JourneyDetailInfoTitle'>
                                <Button type='link' size='large' icon={<CloseOutlined />}
                                    onClick={() =>
                                    {
                                        this.props.history.goBack();
                                    }}
                                />
                                <span>您的房源预定</span>
                            </div>
                            <Divider />
                            <h2>{moment(rentInfo.checkInDate).format("YYYY年MM月DD日") + '-' + moment(rentInfo.checkOutDate).format("YYYY年MM月DD日")}</h2>
                            <Badge.Ribbon text={this.isRefunded ? "已退款" : "已完成"} color={this.isRefunded ? "blue" : "green"}>
                                <h1>您入住了{hInfo.baseInfo.hTitle}</h1>
                            </Badge.Ribbon>
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
                                        <Button type='text' icon={<RightOutlined />} onClick={async () =>
                                        {
                                            this.ExportOrderDetialAsPDF(rentInfo);
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
                                                await MapUtil.MakeJourneyRoute(this.map, e.coords.latitude + ',' + e.coords.longitude, hInfo);
                                                MapUtil.MarkStart(e.coords.latitude + ',' + e.coords.longitude, this.pngMarker);
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
                                    <h2>{this.isRefunded ? "退款金额" : "总费用"}</h2>
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

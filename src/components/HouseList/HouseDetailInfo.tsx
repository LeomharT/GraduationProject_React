import { DollarCircleOutlined, HeartFilled, HeartOutlined, LeftOutlined, LinkOutlined, PhoneOutlined, QuestionOutlined, WechatOutlined } from '@ant-design/icons';
import { Affix, Anchor, Avatar, Badge, Button, Carousel, Divider, message, Popover, Rate, Spin, Tag } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component, createRef } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import mapMarker from '../../assets/img/mapMarker.png';
import mustlook from '../../assets/img/mustlook.png';
import { HouseCarousel, HouseInfo } from '../../interfaces/HouseListInterface';
import AuthStore from '../../redux/AuthStore';
import UserStore from '../../redux/UserStore';
import { VerifyIcon } from '../Common/AppIconTitle';
import { CONST_HOST, LANGUAGE_REFER } from '../Common/VariableGlobal';
import { RenderTags } from './HouseItem';

interface DetailProps extends RouteComponentProps
{

}
const { Link } = Anchor;
@observer
class HouseDetail extends Component<DetailProps, {}>
{
    AuthStore: AuthStore = AuthStore.GetInstance();
    UserStore: UserStore = UserStore.GetInstance();
    @observable houseDetailInfo: HouseInfo;
    tMapRef = createRef<HTMLDivElement>();
    @observable ok: boolean = false;
    InitCarouseList = async (): Promise<HouseInfo> =>
    {
        return (
            await (
                await
                    fetch(`http://localhost:3065/GetHouseDetailInfo?hId=${(this.props.match.params as any).HouseId}`)
            ).json()
        );
    };
    InitMap = () =>
    {
        const { houseDetailInfo } = this;
        const map = new TMap.Map(this.tMapRef.current, {
            center: new TMap.LatLng(
                parseFloat(houseDetailInfo.detailInfo.hLatitude),
                parseFloat(houseDetailInfo.detailInfo.hLongitude)),
            zoom: 18,
            pitch: 43.5,
            rotation: 45,
            viewMode: "2D"
        });
        new TMap.MultiMarker({
            map: map,
            style: {
                markerStyle: new TMap.MarkerStyle({
                    width: 25,
                    height: 35,
                    src: mapMarker,
                    anchor: { x: 16, y: 32 }
                })
            },
            geometries: [{
                id: "1",
                styled: "markerStyle",
                position: new TMap.LatLng(
                    parseFloat(houseDetailInfo.detailInfo.hLatitude),
                    parseFloat(houseDetailInfo.detailInfo.hLongitude)),
                properties: {
                    title: "position01"
                }
            }]
        });
    };
    async componentDidMount()
    {
        this.houseDetailInfo = await this.InitCarouseList();
        this.InitMap();
    }
    render()
    {
        const { history } = this.props;
        const { houseDetailInfo, ok, UserStore, AuthStore } = this;
        if (!houseDetailInfo) return (<Spin size='large' style={{ position: "absolute", top: '40%', left: '50%', marginLeft: "-20px" }} />);
        return (
            <div className='HouseDetailInfo'>
                <div className="CarouselAndBaseInfo" id="CarouselAndBaseInfo">
                    <div className="HCarousel">
                        <div >
                            <div className="HTitle">
                                <Button
                                    type='link'
                                    icon={<LeftOutlined />}
                                    onClick={() =>
                                    {
                                        history.push("/HouseList/Exhibits");
                                    }}
                                />
                                {houseDetailInfo.baseInfo.hTitle}
                                {RenderTags(houseDetailInfo.baseInfo.hTags.split(","))}
                                {houseDetailInfo.baseInfo.isVRed && <Button
                                    icon={<LinkOutlined />}
                                    onClick={() =>
                                    {
                                        window.open("/VRScene");
                                    }}
                                />}

                            </div>
                            <div className="HSubTitle">
                                <span>
                                    维护时间:{moment(houseDetailInfo.detailInfo.Maintain).format("YYYY-MM-DD")}
                                </span>
                                <span>
                                    <VerifyIcon />&nbsp;&nbsp;房屋ID:{houseDetailInfo.baseInfo.hId}
                                </span>
                            </div>
                        </div>
                        <Carousel autoplay>
                            {houseDetailInfo.carousel.map((c: HouseCarousel) =>
                            {
                                return (
                                    <img key={c.id} alt={c.id} src={c.url} />
                                );
                            })}
                        </Carousel>
                    </div>
                    <div className="HBaseInfo">
                        <div className='HRentAndFeature'>
                            <div className="RentAndCollect">
                                <div>
                                    <span>&yen;{houseDetailInfo.baseInfo.hRent}</span>&nbsp;元/月 (月付价)
                                </div>
                                <div
                                    onClick={() =>
                                    {
                                        this.ok = !this.ok;
                                        if (!ok) { message.success("ok"); return; }
                                        message.error("nook");
                                    }}>
                                    {ok && <HeartFilled />}
                                    {!ok && <HeartOutlined />}
                                    关注
                                </div>

                            </div>
                            <img style={{ width: "62px", height: "23px", marginRight: "5px" }} alt="mustLookLook" src={mustlook} />
                            {houseDetailInfo.baseInfo.hFeature.split(',').map(f =>
                            {
                                return (
                                    <Tag key={f} color='default' style={{ height: "30px", lineHeight: "30px" }}>{f}</Tag>
                                );
                            })}
                        </div>
                        <div className="BaseInfoEtc">
                            <div>
                                <div>
                                    租赁方式：{houseDetailInfo.baseInfo.hMethod}
                                </div>
                                <div>
                                    房屋类型：{houseDetailInfo.baseInfo.hLayout + ' ' + houseDetailInfo.detailInfo.Area}
                                </div>
                                <div>
                                    朝向楼层：{houseDetailInfo.baseInfo.hTowards}
                                </div>
                                <div>
                                    风险提示：<Button style={{ padding: "0" }} type="link" href="https://m.ke.com/text/disclaimer">用户风险提示</Button>
                                </div>
                            </div>
                            <div>
                                <Rate
                                    allowClear
                                    defaultValue={4}
                                    character="好"
                                    style={{ color: "#EF615A" }}
                                />
                            </div>
                        </div>
                        <div className="ContactOnlineOrPhone">
                            <div className="LandLordInfo">
                                <Avatar shape="square" size={64} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                这边应该放房东的信息的哎但是做不做呢giao
                            </div>
                            <div>
                                <Button
                                    size="large"
                                    icon={<DollarCircleOutlined />}
                                    type="primary"
                                    onClick={() =>
                                    {
                                        if (UserStore.authInfo.session == null)
                                        {
                                            AuthStore.auth.login();
                                            return;
                                        }
                                        message.success("租的好👌😄");
                                    }}
                                >立即租赁</Button>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Popover
                                    placement="bottom"
                                    trigger='click'
                                    content={(): React.ReactNode =>
                                    {
                                        let visualPhoneNumber = '400';
                                        for (let i = 0; i < 10; i++)
                                        {
                                            visualPhoneNumber += Math.round(Math.random() * 10);
                                        }
                                        return (
                                            <div style={{ padding: "5px" }}>
                                                {visualPhoneNumber}
                                            </div>
                                        );
                                    }}
                                ><Button size="large" icon={<PhoneOutlined />}>电话联系</Button>
                                </Popover>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Button
                                    size="large"
                                    icon={<WechatOutlined />}
                                    type="primary"
                                    onClick={() =>
                                    {
                                        if (UserStore.authInfo.session == null)
                                        {
                                            AuthStore.auth.login();
                                            return;
                                        }
                                        message.success("联系我哦等下还没做出来👈");
                                    }}
                                >在线联系</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Affix offsetTop={0}>
                    <div className="TargetBox">
                        <Anchor affix={false}>
                            <Link title="基本信息" href="#CarouselAndBaseInfo" />
                            <Link title="房屋信息" href="#HDetailInfo" />
                            <Link title="配套设施" href="#HFacilities" />
                            <Link title="房屋描述" href="#Hdescription" />
                            <Link title="费用详情" href="#HRent" />
                            <Link title="房屋位置" href="#HPositionMap"></Link>
                        </Anchor>
                    </div>
                </Affix>
                <Divider orientation="left" className="DividerHouseInfo">房屋信息</Divider>
                <div className='HDetailInfo' id='HDetailInfo'>
                    <span className='SpanTitle'>
                        基本信息
                    </span>
                    <ul className='InfoLists'>
                        <li>面积：{houseDetailInfo.detailInfo.Area}</li>
                        <li>维护：{moment(houseDetailInfo.detailInfo.Maintain).format("YYYY-MM-DD")}</li>
                        <li>楼层：{houseDetailInfo.baseInfo.hFloor}</li>
                        <li>车位：{houseDetailInfo.detailInfo.Parking}</li>
                        <li>用电：{houseDetailInfo.detailInfo.Electricity}</li>
                        <li>采暖：{houseDetailInfo.detailInfo.Warm}</li>
                        <li>租期：随时租退</li>
                        <li>朝向：{houseDetailInfo.baseInfo.hTowards}</li>
                        <li>入住：随时入住</li>
                        <li>看房：随时看房  VR看房</li>
                        <li>电梯：{houseDetailInfo.baseInfo.hElevator}</li>
                        <li>用水：{houseDetailInfo.detailInfo.Water}</li>
                        <li>燃气：{houseDetailInfo.detailInfo.isGas ? "有" : "无"}</li>
                    </ul>
                </div>
                <Divider />
                <div className="HFacilities" id='HFacilities'>
                    <span className='SpanTitle'>
                        配套设施
                    </span>
                    <ul>
                        {Object.keys(houseDetailInfo.detailInfo).map((key: string): React.ReactNode =>
                        {
                            if (!key.includes('is')) return null;
                            return (
                                <li key={key}>
                                    {houseDetailInfo.detailInfo[key]
                                        ? <img alt='facilities' src={`${CONST_HOST}/img/HInfoIcons/${key.substr(2)}Icon.jpg`} />
                                        : <img alt='facilities' src={`${CONST_HOST}/img/HInfoIcons/${key.substr(2)}IconNone.jpg`} />}
                                    <p style={{ textDecoration: !houseDetailInfo.detailInfo[key] ? "line-through" : "none" }}>{
                                        //@ts-ignore
                                        LANGUAGE_REFER[key.substr(2)]}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <Divider orientation="left" className="DividerHouseInfo">房源描述</Divider>
                <div className="Hdescription" id='Hdescription'>
                    <span className='SpanTitle'>
                        房屋描述
                    </span>
                    <ul>
                        {houseDetailInfo.carousel.map((c: HouseCarousel) =>
                        {
                            return (
                                <li key={c.id}>
                                    <img draggable='false' alt="picdes" src={c.url} />
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <Divider />
                <div className="HRent" id='HRent'>
                    <span className='SpanTitle'>
                        费用详情
                    </span>
                    <ul>
                        <li>
                            付款方式
                            <span>月付</span>
                        </li>
                        <li>
                            租金（元/月）
                            <span style={{ color: "#fe615a" }}>{houseDetailInfo.baseInfo.hRent}</span>
                        </li>
                        <li>
                            <Popover
                                content={<div>
                                    服务费包括：物业费，宽带费，垃圾费，家电维修费
                                </div>
                                }>
                                <Badge
                                    count={<QuestionOutlined />}
                                    style={{
                                        fontSize: "12px",
                                        position: "absolute",
                                        cursor: "pointer",
                                    }} />
                            </Popover>
                            服务费（元）
                            <span>{parseInt(houseDetailInfo.baseInfo.hRent) * 0.05}</span>
                        </li>
                        <li>
                            电费（元）
                            <span>0.5 元/度</span>
                        </li>
                        <li>
                            水费（元）
                            <span>1 元/吨</span>
                        </li>
                    </ul>
                </div>
                <Divider orientation="left" className="DividerHouseInfo">位置和地点</Divider>
                <div className="HPositionMap" id="HPositionMap" ref={this.tMapRef} />
            </div>
        );
    }
}



export default withRouter(HouseDetail);

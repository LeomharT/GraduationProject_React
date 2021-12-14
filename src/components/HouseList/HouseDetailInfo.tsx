import { DollarCircleOutlined, FrownOutlined, HeartFilled, HeartOutlined, LeftOutlined, LinkOutlined, MehOutlined, PhoneOutlined, QuestionOutlined, SmileOutlined, WechatOutlined } from '@ant-design/icons';
import { Affix, Anchor, Avatar, BackTop, Badge, Button, Carousel, ConfigProvider, Divider, Image, message, Popover, Rate, Spin, Tag } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component, createRef } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import mapMarker from '../../assets/img/mapMarker.png';
import mustlook from '../../assets/img/mustlook.png';
import { HouseCarousel, HouseInfo } from '../../interfaces/HouseListInterface';
import HouseStore from '../../redux/HouseStore';
import UserStore from '../../redux/UserStore';
import { Render404, VerifyIcon } from '../Common/AppIconTitle';
import Footer from '../Common/Footer';
import { CONST_HOST, LANGUAGE_REFER, SpinStyle } from '../Common/VariableGlobal';
import HComment from './HComment';
import { RenderTags } from './HouseItem';

interface DetailProps extends RouteComponentProps
{

}
const { Link } = Anchor;
const rateIcons = {
    1: <FrownOutlined />,
    2: <FrownOutlined />,
    3: <MehOutlined />,
    4: <SmileOutlined />,
    5: <SmileOutlined />,
};

@observer
class HouseDetail extends Component<DetailProps, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    UserStore: UserStore = UserStore.GetInstance();
    @observable houseDetailInfo: HouseInfo;
    tMapRef = createRef<HTMLDivElement>();
    @observable isCollected: boolean = false;
    InitMap = (): void =>
    {
        const { houseDetailInfo } = this;
        if (!houseDetailInfo?.baseInfo) return;
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
    CheckForCurrentHouseIsCollected = (): void =>
    {
        if (!this.UserStore.authInfo.session) return;
        const { id } = this.UserStore?.authInfo?.userInfo ?? undefined;
        const { hId } = this.houseDetailInfo.baseInfo;
        if (!id) { this.isCollected = false; return; }
        fetch(`${CONST_HOST}/GetHouseCollectInfo?id=${id}&hId=${hId}`)
            .then(res => res.json())
            .then(data =>
            {
                this.isCollected = data.isCollected;
            })
            .catch((err) =>
            {
                throw new Error(err);
            });
    };
    CollectCurrentHouse = async (hId: string | number) =>
    {
        const { id } = this.UserStore?.authInfo?.userInfo ?? undefined;
        if (!id) return;
        let res = await fetch(`${CONST_HOST}/CollectHouse?id=${id}&hId=${hId}`);
        let result = await res.json();
        if (result.affectedRows as boolean)
        {
            message.success("添加收藏成功");
        }
        else
        {
            message.error("添加收藏失败");
        }
        this.CheckForCurrentHouseIsCollected();
    };




    async componentDidMount()
    {
        this.houseDetailInfo = await this.HouseStore.InitHouseInfo((this.props.match.params as any).HouseId);
        if (!this.houseDetailInfo?.baseInfo) return;
        this.InitMap();
        this.CheckForCurrentHouseIsCollected();

        /**
         * @description 因为VR界面是window.open(),所以做一个数据持久化.
         */
        this.houseDetailInfo?.baseInfo
            ? sessionStorage.setItem("houseInfo", JSON.stringify(this.houseDetailInfo))
            : sessionStorage.clear();

    }
    render()
    {
        const { history } = this.props;
        const { houseDetailInfo, isCollected, UserStore, HouseStore } = this;
        if (!houseDetailInfo) return (<Spin size='large' style={SpinStyle} />);
        if (!houseDetailInfo?.baseInfo) return (<Render404 title='404!未找到该房源' subTitle='您寻找的房源编号不存在,请返回列表页.' />);
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
                                    type='link'
                                    size='large'
                                    onClick={() =>
                                    {
                                        window.open(`/VRScene/${houseDetailInfo.baseInfo.hId}`);
                                    }}
                                >VR看房</Button>}

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
                                    <img key={c.id} alt={c.id} src={`${CONST_HOST}/${c.url}`} />
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
                                    onClick={async () =>
                                    {
                                        if (UserStore.CheckForIsLogin())
                                        {
                                            if (isCollected)
                                            {
                                                await HouseStore.DeleteCurrentHouseFromUserCollections(
                                                    UserStore.authInfo.userInfo.id,
                                                    houseDetailInfo.baseInfo.hId,
                                                    this.CheckForCurrentHouseIsCollected
                                                );
                                            } else
                                            {

                                                await this.CollectCurrentHouse(houseDetailInfo.baseInfo.hId);
                                            }
                                        }

                                    }}>
                                    {Boolean(isCollected) && <HeartFilled />}
                                    {Boolean(!isCollected) && <HeartOutlined />}
                                    关注
                                </div>

                            </div>
                            <img style={{ width: "62px", height: "23px", marginRight: "5px", marginBottom: "3px" }} alt="mustLookLook" src={mustlook} />
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
                                    //@ts-ignore
                                    character={({ index }) => rateIcons[index + 1]}
                                    style={{ color: "#EF615A" }}
                                />
                            </div>
                        </div>
                        <Badge.Ribbon text={houseDetailInfo.baseInfo.isRented ? "已租出" : "立即入住"} color={houseDetailInfo.baseInfo.isRented ? "" : "green"}>
                            <div className="ContactOnlineOrPhone">
                                <div className="LandLordInfo">
                                    <Avatar
                                        size='large'
                                        src='https://joeschmoe.io/api/v1/random'
                                        style={{ marginRight: "20px" }}
                                    />
                                    {houseDetailInfo.baseInfo.hTitle.substr(0, 2)}社区
                                </div>
                                <div>
                                    <Button
                                        disabled={
                                            Boolean(houseDetailInfo.baseInfo.isRented)
                                        }
                                        size="large"
                                        icon={<DollarCircleOutlined />}
                                        type="primary"
                                        onClick={async () =>
                                        {
                                            if (UserStore.CheckForIsLogin())
                                            {
                                                if ((await UserStore.InitCurrentUserRentList(UserStore.GetCurrentUserId())).length)
                                                {
                                                    message.error('您已经租有一套公寓了哦');
                                                    return;
                                                }
                                                history.push(`/HouseList/ConfirmOrder/${houseDetailInfo.baseInfo.hId}`);
                                            }
                                        }}
                                    >立即预约</Button>
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
                                            if (UserStore.CheckForIsLogin())
                                            {
                                                UserStore.showChat = true;
                                            }
                                        }}
                                    >在线联系</Button>
                                </div>
                            </div>
                        </Badge.Ribbon>
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
                            <Link title="房源评论" href="#HComment"></Link>
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
                        <ConfigProvider locale={zhCN}>
                            <Image.PreviewGroup>
                                {houseDetailInfo.carousel.map((c: HouseCarousel) =>
                                {
                                    return (
                                        <Image key={c.id} src={`${CONST_HOST}/${c.url}`} />
                                    );
                                })}
                            </Image.PreviewGroup>
                        </ConfigProvider>
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
                <Divider orientation="left" className="DividerHouseInfo">房源评论</Divider>
                <ConfigProvider locale={zhCN}>
                    <HComment houseDetailInfo={this.houseDetailInfo} />
                </ConfigProvider>
                <Divider />
                <BackTop />
                <Footer />
            </div>
        );
    }
}



export default withRouter(HouseDetail);

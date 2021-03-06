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
            message.success("??????????????????");
        }
        else
        {
            message.error("??????????????????");
        }
        this.CheckForCurrentHouseIsCollected();
    };




    async componentDidMount()
    {
        this.houseDetailInfo = await this.HouseStore.InitHouseInfoIfetch((this.props.match.params as any).HouseId);
        if (!this.houseDetailInfo?.baseInfo) return;
        this.InitMap();
        this.CheckForCurrentHouseIsCollected();

        /**
         * @description ??????VR?????????window.open(),??????????????????????????????.
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
        if (!houseDetailInfo?.baseInfo) return (<Render404 title='404!??????????????????' subTitle='?????????????????????????????????,??????????????????.' />);
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
                                >VR??????</Button>}

                            </div>
                            <div className="HSubTitle">
                                <span>
                                    ????????????:{moment(houseDetailInfo.detailInfo.Maintain).format("YYYY-MM-DD")}
                                </span>
                                <span>
                                    <VerifyIcon />&nbsp;&nbsp;??????ID:{houseDetailInfo.baseInfo.hId}
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
                                    <span>&yen;{houseDetailInfo.baseInfo.hRent}</span>&nbsp;???/??? (?????????)
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
                                    ??????
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
                                    ???????????????{houseDetailInfo.baseInfo.hMethod}
                                </div>
                                <div>
                                    ???????????????{houseDetailInfo.baseInfo.hLayout + ' ' + houseDetailInfo.detailInfo.Area}
                                </div>
                                <div>
                                    ???????????????{houseDetailInfo.baseInfo.hTowards}
                                </div>
                                <div>
                                    ???????????????<Button style={{ padding: "0" }} type="link" href="https://m.ke.com/text/disclaimer">??????????????????</Button>
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
                        <Badge.Ribbon text={houseDetailInfo.baseInfo.isRented ? "?????????" : "????????????"} color={houseDetailInfo.baseInfo.isRented ? "" : "green"}>
                            <div className="ContactOnlineOrPhone">
                                <div className="LandLordInfo">
                                    <Avatar
                                        size='large'
                                        src='https://joeschmoe.io/api/v1/random'
                                        style={{ marginRight: "20px" }}
                                    />
                                    {houseDetailInfo.baseInfo.hTitle.substr(0, 2)}??????
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
                                                    message.error('?????????????????????????????????');
                                                    return;
                                                }
                                                history.push(`/HouseList/ConfirmOrder/${houseDetailInfo.baseInfo.hId}`);
                                            }
                                        }}
                                    >????????????</Button>
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
                                    ><Button size="large" icon={<PhoneOutlined />}>????????????</Button>
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
                                    >????????????</Button>
                                </div>
                            </div>
                        </Badge.Ribbon>
                    </div>
                </div>
                <Affix offsetTop={0}>
                    <div className="TargetBox">
                        <Anchor affix={false}>
                            <Link title="????????????" href="#CarouselAndBaseInfo" />
                            <Link title="????????????" href="#HDetailInfo" />
                            <Link title="????????????" href="#HFacilities" />
                            <Link title="????????????" href="#Hdescription" />
                            <Link title="????????????" href="#HRent" />
                            <Link title="????????????" href="#HPositionMap"></Link>
                            <Link title="????????????" href="#HComment"></Link>
                        </Anchor>
                    </div>
                </Affix>
                <Divider orientation="left" className="DividerHouseInfo">????????????</Divider>
                <div className='HDetailInfo' id='HDetailInfo'>
                    <span className='SpanTitle'>
                        ????????????
                    </span>
                    <ul className='InfoLists'>
                        <li>?????????{houseDetailInfo.detailInfo.Area}</li>
                        <li>?????????{moment(houseDetailInfo.detailInfo.Maintain).format("YYYY-MM-DD")}</li>
                        <li>?????????{houseDetailInfo.baseInfo.hFloor}</li>
                        <li>?????????{houseDetailInfo.detailInfo.Parking}</li>
                        <li>?????????{houseDetailInfo.detailInfo.Electricity}</li>
                        <li>?????????{houseDetailInfo.detailInfo.Warm}</li>
                        <li>?????????????????????</li>
                        <li>?????????{houseDetailInfo.baseInfo.hTowards}</li>
                        <li>?????????????????????</li>
                        <li>?????????????????????  VR??????</li>
                        <li>?????????{houseDetailInfo.baseInfo.hElevator}</li>
                        <li>?????????{houseDetailInfo.detailInfo.Water}</li>
                        <li>?????????{houseDetailInfo.detailInfo.isGas ? "???" : "???"}</li>
                    </ul>
                </div>
                <Divider />
                <div className="HFacilities" id='HFacilities'>
                    <span className='SpanTitle'>
                        ????????????
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
                <Divider orientation="left" className="DividerHouseInfo">????????????</Divider>
                <div className="Hdescription" id='Hdescription'>
                    <span className='SpanTitle'>
                        ????????????
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
                        ????????????
                    </span>
                    <ul>
                        <li>
                            ????????????
                            <span>??????</span>
                        </li>
                        <li>
                            ????????????/??????
                            <span style={{ color: "#fe615a" }}>{houseDetailInfo.baseInfo.hRent}</span>
                        </li>
                        <li>
                            <Popover
                                content={<div>
                                    ?????????????????????????????????????????????????????????????????????
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
                            ??????????????????
                            <span>{parseInt(houseDetailInfo.baseInfo.hRent) * 0.05}</span>
                        </li>
                        <li>
                            ???????????????
                            <span>0.5 ???/???</span>
                        </li>
                        <li>
                            ???????????????
                            <span>1 ???/???</span>
                        </li>
                    </ul>
                </div>
                <Divider orientation="left" className="DividerHouseInfo">???????????????</Divider>
                <div className="HPositionMap" id="HPositionMap" ref={this.tMapRef} />
                <Divider orientation="left" className="DividerHouseInfo">????????????</Divider>
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

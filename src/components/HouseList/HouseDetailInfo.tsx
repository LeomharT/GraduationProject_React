import { HeartFilled, HeartOutlined, LeftOutlined, LinkOutlined, PhoneOutlined, WechatOutlined } from '@ant-design/icons';
import { Affix, Anchor, Avatar, Button, Carousel, Popover, Spin, Tag } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import mustlook from '../../assets/img/mustlook.png';
import { HouseCarousel, HouseInfo } from '../../interfaces/HouseListInterface';
import AuthStore from '../../redux/AuthStore';
import UserStore from '../../redux/UserStore';
import { VerifyIcon } from '../Common/AppIconTitle';
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
    async componentDidMount()
    {
        this.houseDetailInfo = await this.InitCarouseList();
        console.log(this.houseDetailInfo);
    }
    render()
    {
        const { history } = this.props;
        const { houseDetailInfo, ok, UserStore } = this;
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
                                    onClick={() => { this.ok = !this.ok; }}>
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
                        <div className="ContactOnlineOrPhone">
                            <div className="LandLordInfo">
                                <Avatar shape="square" size={64} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                这边应该放房东的信息的哎但是做不做呢giao
                            </div>
                            <div>
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
                                >
                                    <Button size="large" icon={<PhoneOutlined />}>电话联系</Button>
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

                                        }
                                    }}
                                >
                                    在线联系
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Affix offsetTop={10}>
                    <div className="TargetBox">
                        <Anchor affix={false}>
                            <Link title="基本信息" href="#CarouselAndBaseInfo" />
                            <Link title="房屋信息" href="#CarouselAndBaseInfo" />
                        </Anchor>
                    </div>
                </Affix>
                <div className='HDetailInfo'>

                </div>
                <div className="HFacilities">

                </div>
                <div className="HRent">

                </div>
            </div>
        );
    }
}



export default withRouter(HouseDetail);

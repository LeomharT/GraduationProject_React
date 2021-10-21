import { EllipsisOutlined, EnvironmentOutlined, ExportOutlined, HomeOutlined, MoneyCollectOutlined, QrcodeOutlined, ToolOutlined } from '@ant-design/icons';
import { Button, Card, Carousel, Dropdown, Menu, Popover, Spin } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component, createRef, RefObject } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { HouseCarousel, HouseInfo } from '../../interfaces/HouseListInterface';
import { UserRentListItem } from '../../interfaces/UserInferface';
import HouseStore from '../../redux/HouseStore';
import UserStore from '../../redux/UserStore';
import { Render404 } from '../Common/AppIconTitle';
import { CONST_HOST } from '../Common/VariableGlobal';
import { RenderTags } from '../HouseList/HouseItem';

const { Meta } = Card;
const RestOfRentDay = (rentInfo: UserRentListItem): number =>
{
    if (moment(rentInfo.checkInDate).format("YYYY-MM-DD") > moment(Date.now()).format('YYYY-MM-DD'))
    {
        return (
            moment(rentInfo.checkOutDate).diff(moment(rentInfo.checkInDate), 'day')
        );
    }
    return (
        moment(rentInfo.checkOutDate).diff(moment(Date.now()), 'day')
    );
};
const RenderQrKey = (rentInfo: UserRentListItem): string =>
{
    let isOpenable: string = '';
    if (moment(rentInfo.checkOutDate) > moment(Date.now()) && moment(rentInfo.checkInDate) < moment(Date.now()))
    {
        isOpenable = '能开';
    } else
    {
        isOpenable = '不能开';
    }
    return `https://api.pwmqr.com/qrcode/create/?url=${isOpenable}`;
};

declare interface U_UserRentsProps extends RouteComponentProps
{

}

@observer
class U_UserRents extends Component<U_UserRentsProps, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    HouseStore: HouseStore = HouseStore.GetInstance();
    tMap: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    @observable userRentList: UserRentListItem[] = [];
    @observable houseInfo: HouseInfo;
    InitTMap = (houseDetailInfo: HouseInfo): void =>
    {
        if (!houseDetailInfo?.baseInfo) return;
        const map = new TMap.Map(this.tMap.current, {
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
    InitOrderState = async (): Promise<void> =>
    {
        this.userRentList = await this.UserStore.InitCurrentUserRentList(this.UserStore.GetCurrentUserId());
    };
    GoToRenewalOrder = (): void =>
    {
        const urlState = {};
        Object.assign(urlState, {
            orderId: this.userRentList[0].orderId,
            checkOutDate: this.userRentList[0].checkOutDate
        });
        this.props.history.push(`/HouseList/ConfirmOrder/${this.houseInfo.baseInfo.hId}`, { urlState });
    };
    async componentDidMount()
    {
        await this.InitOrderState();
        if (this.userRentList.length)
        {
            this.houseInfo = await this.HouseStore.InitHouseInfo(this.userRentList[0].hId);
            this.InitTMap(this.houseInfo);
        }
    }
    render()
    {
        const { userRentList, houseInfo } = this;
        if (!userRentList.length) return (<Render404 title='您还没用任何租约' subTitle='您还没有签约，快去看看吧' />);
        if (!houseInfo) return (<Spin size='large' />);
        return (
            <div className='U_UserRents'>
                {userRentList.map((rentInfo: UserRentListItem) =>
                {
                    return (
                        <Card
                            hoverable
                            key={rentInfo.orderId}
                            cover={
                                <div className='RentInfoCover'>
                                    <Carousel autoplay >
                                        {houseInfo.carousel.map((c: HouseCarousel) =>
                                        {
                                            return (
                                                <img key={c.id} alt={c.id} src={`${CONST_HOST}/${c.url}`} />
                                            );
                                        })}
                                    </Carousel>
                                    <div className='RentInfo'>
                                        <div>
                                            {houseInfo.baseInfo.hTitle}
                                            {RenderTags(houseInfo.baseInfo.hTags.split(","))}
                                            <Dropdown
                                                trigger={['click']}
                                                overlay={
                                                    <Menu>
                                                        <Menu.Item key='detail'>
                                                            <Link to={`/HouseList/DetailInfo/${houseInfo.baseInfo.hId}`}>
                                                                详细信息
                                                            </Link>
                                                        </Menu.Item>
                                                    </Menu>
                                                }>
                                                <Button
                                                    icon={<EllipsisOutlined />}
                                                    type='link'
                                                />
                                            </Dropdown>
                                        </div>
                                        <div>
                                            <EnvironmentOutlined />{houseInfo.baseInfo.hRegion}&nbsp;&nbsp;
                                            <HomeOutlined />{houseInfo.baseInfo.hLayout}&nbsp;&nbsp;
                                            {houseInfo.detailInfo.Area}
                                        </div>
                                        <div ref={this.tMap} />
                                    </div>
                                </div>
                            }
                            actions={
                                [
                                    <Button
                                        size='large'
                                        children={'续租'}
                                        type='primary'
                                        icon={<MoneyCollectOutlined />}
                                        onClick={this.GoToRenewalOrder}
                                    />,
                                    <Button size='large' children={'报修'} type='primary' icon={<ToolOutlined />} />,
                                    <Popover
                                        trigger='click'
                                        placement='top'
                                        content={
                                            <img alt='QRKey' src={RenderQrKey(rentInfo)} />
                                        }
                                    >
                                        <Button size='large' children={'开门码'} type='primary' icon={<QrcodeOutlined />} />
                                    </Popover>,
                                    <Button size='large' children={'退租'} danger type='primary' icon={<ExportOutlined />} />,
                                ]
                            }
                        >
                            <Meta
                                title={
                                    <div className='RentRestOfDays' style={{
                                        color: RestOfRentDay(rentInfo) > 10 ? "#52c41a" : '#fe615a'
                                    }}>
                                        剩余{RestOfRentDay(rentInfo)}天
                                    </div>
                                }
                                description={
                                    <div className='CheckDate'>
                                        <span>
                                            入住日期:{moment(rentInfo.checkInDate).format("YYYY-MM-DD")}
                                        </span>
                                        <span>
                                            退房时间:{moment(rentInfo.checkOutDate).format("YYYY-MM-DD")}
                                        </span>
                                    </div>
                                }
                            />
                        </Card>
                    );
                })
                }
            </div>
        );
    }
}
export default withRouter(U_UserRents);

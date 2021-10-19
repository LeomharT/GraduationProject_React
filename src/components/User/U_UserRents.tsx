import { EnvironmentOutlined, ExportOutlined, HomeOutlined, MoneyCollectOutlined, QrcodeOutlined, ToolOutlined } from '@ant-design/icons';
import { Button, Card, Popover, Spin } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component, createRef, RefObject } from 'react';
import { HouseInfo } from '../../interfaces/HouseListInterface';
import { UserRentListItem } from '../../interfaces/UserInferface';
import HouseStore from '../../redux/HouseStore';
import UserStore from '../../redux/UserStore';
import { CONST_HOST } from '../Common/VariableGlobal';

const { Meta } = Card;
const RestOfRentDay = (checkOutDate: Date): number =>
{
    return (
        moment(checkOutDate).diff(moment(Date.now()), 'day')
    );
};
const RenderQrKey = (checkOutDate: Date): string =>
{
    let isOpenable: string = '';
    if (moment(checkOutDate) > moment(Date.now()))
    {
        isOpenable = '能开';
    } else
    {
        isOpenable = '不能开';
    }
    return `https://api.pwmqr.com/qrcode/create/?url=${isOpenable}`;
};
@observer
export default class U_UserRents extends Component<{}, {}>
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
    async componentDidMount()
    {
        this.userRentList = await this.UserStore.InitCurrentUserRentList(this.UserStore.GetCurrentUserId());
        if (this.userRentList.length)
        {
            this.houseInfo = await this.HouseStore.InitHouseInfo(this.userRentList[0].hId);
            this.InitTMap(this.houseInfo);
        }
    }
    render()
    {
        const { userRentList, houseInfo } = this;
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
                                    <img alt='cover' src={`${CONST_HOST}/${houseInfo.baseInfo.hExhibitImg}`} />
                                    <div className='RentInfo'>
                                        <div>{houseInfo.baseInfo.hTitle}</div>
                                        <div>
                                            <EnvironmentOutlined />{houseInfo.baseInfo.hRegion}
                                            <HomeOutlined />{houseInfo.baseInfo.hLayout}
                                        </div>
                                        <div ref={this.tMap}>

                                        </div>
                                    </div>
                                </div>
                            }
                            actions={
                                [
                                    <Button size='large' children={'我要续租'} type='primary' icon={<MoneyCollectOutlined />} />,
                                    <Button size='large' children={'我要报修'} type='primary' icon={<ToolOutlined />} />,
                                    <Popover
                                        trigger='click'
                                        placement='top'
                                        content={
                                            <img alt='QRKey' src={RenderQrKey(rentInfo.checkOutDate)} />
                                        }
                                    >
                                        <Button size='large' children={'我的开门码'} type='primary' icon={<QrcodeOutlined />} />
                                    </Popover>,
                                    <Button size='large' children={'我要退租'} danger type='primary' icon={<ExportOutlined />} />,
                                ]
                            }
                        >
                            <Meta
                                title={
                                    <div className='RentRestOfDays' style={{
                                        color: RestOfRentDay(rentInfo.checkOutDate) > 10 ? "#52c41a" : '#fe615a'
                                    }}>
                                        剩余{RestOfRentDay(rentInfo.checkOutDate)}天
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
            </div >
        );
    }
}

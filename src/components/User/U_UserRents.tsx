import { ExportOutlined, MoneyCollectOutlined, QrcodeOutlined, QuestionOutlined, ToolOutlined } from '@ant-design/icons';
import { Badge, Button, Popover, Spin } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import { HouseInfo } from '../../interfaces/HouseListInterface';
import { UserRentListItem } from '../../interfaces/UserInferface';
import HouseStore from '../../redux/HouseStore';
import UserStore from '../../redux/UserStore';
import HouseItem from '../HouseList/HouseItem';

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
    @observable userRentList: UserRentListItem[] = [];
    @observable houseInfo: HouseInfo;
    async componentDidMount()
    {
        this.userRentList = await this.UserStore.InitCurrentUserRentList(this.UserStore.GetCurrentUserId());
        if (this.userRentList.length)
        {
            this.houseInfo = await this.HouseStore.InitHouseInfo(this.userRentList[0].hId);
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
                        <div className='RentItem' key={rentInfo.orderId}>
                            <div className='RentTitle'>
                                <Popover
                                    content={<div>
                                        您可以在这里选择退房和续租
                                    </div>
                                    }>
                                    <Badge
                                        count={<QuestionOutlined />}
                                        style={{
                                            fontSize: "12px",
                                            position: "absolute",
                                            cursor: "pointer",
                                        }}
                                        children={
                                            <div>我的租约({`${userRentList.length}`})---
                                                <span style={{ color: RestOfRentDay(rentInfo.checkOutDate) > 10 ? '#52c41a' : "#fe615a" }}>
                                                    剩余{RestOfRentDay(rentInfo.checkOutDate)}天
                                                </span>
                                            </div>
                                        }
                                    />
                                </Popover>
                            </div>
                            <HouseItem HouseInfo={houseInfo.baseInfo} />
                            <div className='RentInfo'>
                                <span>
                                    入住日期:{moment(rentInfo.checkInDate).format("YYYY-MM-DD")}
                                </span>
                                <span>
                                    退房日期:{moment(rentInfo.checkOutDate).format("YYYY-MM-DD")}
                                </span>
                            </div>
                            <div className='RentOptions'>
                                <Button size='large' children={'我要续租'} type='primary' icon={<MoneyCollectOutlined />} />
                                <Button size='large' children={'我要报修'} type='primary' icon={<ToolOutlined />} />
                                <Popover
                                    trigger='click'
                                    placement='top'
                                    content={
                                        <img alt='QRKey' src={RenderQrKey(rentInfo.checkOutDate)} />
                                    }
                                >
                                    <Button size='large' children={'我的开门码'} type='primary' icon={<QrcodeOutlined />} />
                                </Popover>
                                <Button size='large' children={'我要退租'} danger type='primary' icon={<ExportOutlined />} />
                            </div>
                        </div >
                    );
                })
                }
            </div >
        );
    }
}

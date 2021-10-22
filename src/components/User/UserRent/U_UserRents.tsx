import { BellOutlined, EllipsisOutlined, MoneyCollectOutlined, SettingOutlined, ToolOutlined, TransactionOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Dropdown, Menu, Spin, Tabs } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment, { unitOfTime } from 'moment';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { HouseInfo } from '../../../interfaces/HouseListInterface';
import { UserRentListItem } from '../../../interfaces/UserInferface';
import HouseStore from '../../../redux/HouseStore';
import UserStore from '../../../redux/UserStore';
import { Render404 } from '../../Common/AppIconTitle';
import { RenderTags } from '../../HouseList/HouseItem';
import CostDetail, { FormatNum } from './CostDetail';
import PositionInfo from './PositionInfo';


const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const RestOfRentDay = (rentInfo: UserRentListItem, dateType: unitOfTime.Base): number =>
{
    if (moment(rentInfo.checkInDate).format("YYYY-MM-DD") > moment(Date.now()).format('YYYY-MM-DD'))
    {
        return (
            moment(rentInfo.checkOutDate).diff(moment(rentInfo.checkInDate), dateType)
        );
    }
    return (
        moment(rentInfo.checkOutDate).diff(moment(Date.now()), dateType)
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
    @observable userRentList: UserRentListItem[] = [];
    @observable houseInfo: HouseInfo;

    InitOrderState = async (): Promise<void> =>
    {
        this.userRentList = await this.UserStore.InitCurrentUserRentList(this.UserStore.GetCurrentUserId());
    };
    GoToRenewalOrder = (): void =>
    {
        const urlState = {};
        Object.assign(urlState, {
            orderId: this.userRentList[0].orderId,
            totalAmount: this.userRentList[0].totalAmount,
            checkOutDate: this.userRentList[0].checkOutDate,
        });
        this.props.history.push(`/HouseList/ConfirmOrder/${this.houseInfo.baseInfo.hId}`, { urlState });
    };
    async componentDidMount()
    {
        await this.InitOrderState();
        if (this.userRentList.length)
        {
            this.houseInfo = await this.HouseStore.InitHouseInfo(this.userRentList[0].hId);
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
                        <div className='UserRentInfo' key={rentInfo.orderId}>
                            <div className='RentTitleAndAction'>
                                <div className='R_Title'>
                                    <div>
                                        {houseInfo.baseInfo.hTitle}
                                        {RenderTags(houseInfo.baseInfo.hTags.split(","))}
                                    </div>
                                    <div>
                                        <Button type='link' icon={<BellOutlined />} />
                                        <Dropdown overlay={
                                            <Menu>
                                                <Menu.Item key='1'
                                                    onClick={() => this.props.history.push(`/HouseList/DetailInfo/${houseInfo.baseInfo.hId}`)}
                                                >详细信息
                                                </Menu.Item>
                                            </Menu>
                                        }><Button type='link' icon={<EllipsisOutlined />} />
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className='R_Actions'>
                                    <Button size='large' type='link'
                                        icon={<MoneyCollectOutlined />}
                                        children='续租' onClick={this.GoToRenewalOrder} />
                                    <Divider type='vertical' />
                                    <Button size='large' type='link' icon={<ToolOutlined />} children='报修' />
                                    <Divider type='vertical' />
                                    <Button size='large' type='link' icon={<TransactionOutlined />} danger children='退租' />
                                </div>
                            </div>
                            <Divider />
                            <div className='RrentDate'>
                                <div>
                                    <div className='Date_Description'>剩余天数</div>
                                    <div
                                        className='Date_Info'
                                        style={{ color: RestOfRentDay(rentInfo, 'day') < 10 ? 'red' : '#52c41a' }}
                                    >
                                        <span>天</span>
                                        {RestOfRentDay(rentInfo, 'day')}
                                    </div>
                                </div>
                                <Divider type='vertical' />
                                <div>
                                    <div className='Date_Description'>剩余月数</div>
                                    <div
                                        className='Date_Info'
                                        style={{ color: RestOfRentDay(rentInfo, 'day') < 10 ? 'red' : '#52c41a' }}
                                    >
                                        <span>月</span>
                                        {RestOfRentDay(rentInfo, 'month')}
                                    </div>
                                </div>
                                <Divider type='vertical' />
                                <div>
                                    <div className='Date_Description'>订单总额</div>
                                    <div className='Date_Info' style={{ color: "#fe615a" }}>
                                        <span>&yen;</span>
                                        {FormatNum(parseFloat(rentInfo.totalAmount).toFixed(2))}
                                    </div>
                                </div>
                                <Divider type='vertical' />
                                <div>
                                    <div className='Date_Description'>入住日期</div>
                                    <div className='Date_Info'>
                                        {moment(rentInfo.checkInDate).format('YYYY/MM/DD')}
                                    </div>
                                </div>
                                <Divider type='vertical' />
                                <div>
                                    <div className='Date_Description'>退房日期</div>
                                    <div className='Date_Info'>
                                        {moment(rentInfo.checkOutDate).format('YYYY/MM/DD')}
                                    </div>
                                </div>
                            </div>
                            <Divider />
                            <Tabs size='large' defaultActiveKey='1' tabBarExtraContent={{
                                right:
                                    <>
                                        <RangePicker locale={locale} />
                                        <Button type='link' icon={<SettingOutlined />} />
                                    </>
                            }} >
                                <TabPane key='1' tab='费用详情'>
                                    <CostDetail rentInfo={rentInfo} />
                                </TabPane>
                                <TabPane key='2' tab='位置信息'>
                                    <PositionInfo houseInfo={this.houseInfo} />
                                </TabPane>
                                <TabPane key='3' tab='扫码开门' style={{ display: "flex", justifyContent: "center" }}>
                                    <img alt='QR' src={RenderQrKey(rentInfo)} />
                                </TabPane>
                            </Tabs>
                        </div>
                    );
                })}
            </div>
        );
    }
}
export default withRouter(U_UserRents);
import { BellOutlined, EllipsisOutlined, MoneyCollectOutlined, SettingOutlined, ToolOutlined, TransactionOutlined } from '@ant-design/icons';
import { Badge, Button, DatePicker, Divider, Dropdown, Menu, Popover, Spin, Tabs } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment, { unitOfTime } from 'moment';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { HouseInfo } from '../../../interfaces/HouseListInterface';
import { OrderState } from '../../../interfaces/PaymentInterface';
import { UserRentListItem } from '../../../interfaces/UserInferface';
import HouseStore from '../../../redux/HouseStore';
import UserStore from '../../../redux/UserStore';
import { Render404, StateIcon } from '../../Common/AppIconTitle';
import { CONST_HOST, LANGUAGE_REFER } from '../../Common/VariableGlobal';
import { RenderTags } from '../../HouseList/HouseItem';
import CostDetail, { FormatNum } from './CostDetail';
import PositionInfo from './PositionInfo';
import RenewalRecord from './RenewalRecord';


const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const RestOfRentDay = (rentInfo: UserRentListItem, dateType: unitOfTime.Base): number =>
{
    if (moment(rentInfo.checkInDate) > moment(Date.now()))
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
    GoToRenewalOrder = (rentInfo: UserRentListItem): void =>
    {
        const urlState = {};
        Object.assign(urlState, {
            id: rentInfo.id,
            orderId: rentInfo.orderId,
            totalAmount: rentInfo.totalAmount,
            checkOutDate: rentInfo.checkOutDate,
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
                                        <Popover placement='bottom'
                                            trigger={['click']}
                                            content={
                                                <div className='RentTip'>
                                                    <ul>
                                                        <li>
                                                            <img src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" alt="infoIcon" />
                                                            <div>
                                                                <div>
                                                                    十月份水电费用详情
                                                                </div>
                                                                <div>
                                                                    {moment(Date.now()).fromNow()}
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <img src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" alt="infoIcon" />
                                                            <div>
                                                                <div>
                                                                    房屋马上到期请及时交付
                                                                </div>
                                                                <div>
                                                                    {moment(Date.now()).fromNow()}
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <img src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" alt="infoIcon" />
                                                            <div>
                                                                <div>
                                                                    通知通知通知
                                                                </div>
                                                                <div>
                                                                    {moment(Date.now()).fromNow()}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    <div>
                                                        <Button size='large' type='text' children='清空通知' />
                                                        <Divider type='vertical' />
                                                        <Button size='large' type='text' children='查看更多' />
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <Badge dot offset={[-15, 10]}>
                                                <Button type='link' icon={<BellOutlined />} />
                                            </Badge>
                                        </Popover>
                                        <Dropdown trigger={['click']} overlay={
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
                                    <Button size='large'
                                        type='link'
                                        icon={<MoneyCollectOutlined />}
                                        children='续租'
                                        onClick={() => { this.GoToRenewalOrder(rentInfo); }} />
                                    <Divider type='vertical' />
                                    <Button
                                        size='large'
                                        type='link'
                                        icon={<ToolOutlined />}
                                        children='报修'
                                        onClick={() =>
                                        {
                                            this.props.history.push('/HouseList/HouseRepair', { rentInfo: JSON.stringify(rentInfo) });
                                        }} />
                                    <Divider type='vertical' />
                                    <Button size='large'
                                        type='link'
                                        icon={<TransactionOutlined />}
                                        danger
                                        children='退租'
                                        onClick={() =>
                                        {
                                            this.props.history.push('/HouseList/RefundOrder', { rentInfo: JSON.stringify(rentInfo) });
                                        }} />
                                    <Divider type='vertical' />
                                    {(() =>
                                    {
                                        if (moment(rentInfo.checkInDate) < moment(Date.now()) && moment(rentInfo.checkOutDate) > moment(Date.now()))
                                        {
                                            return (<StateIcon state={OrderState.processing} />);
                                        } else if (moment(rentInfo.checkOutDate) < moment(Date.now()))
                                        {
                                            return (<StateIcon state={OrderState.close} />);
                                        } else
                                        {
                                            return (<StateIcon state={OrderState.wating} />);
                                        }
                                    })()}
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
                            <div className='FurnitureState'>
                                {Object.keys(LANGUAGE_REFER).map((key: string) =>
                                {
                                    return (
                                        <FurnitureItem
                                            id={key}
                                            key={key}
                                            //@ts-ignore
                                            value={LANGUAGE_REFER[key]}
                                            //@ts-ignore
                                            type={LANGUAGE_REFER[key]}
                                        />
                                    );
                                })}
                            </div>
                            <Divider />
                            <Tabs size='large' defaultActiveKey='1' tabBarExtraContent={{
                                right:
                                    <>
                                        <RangePicker locale={locale} onChange={async (v) =>
                                        {
                                            this.UserStore.renewalRecordList = await this.UserStore.InitRenewalOrderList(rentInfo.id, v);
                                        }} />
                                        <Button type='link' icon={<SettingOutlined />} />
                                    </>
                            }} >
                                <TabPane key='1' tab='费用详情'>
                                    <CostDetail rentInfo={rentInfo} />
                                </TabPane>
                                <TabPane key='2' tab='位置信息'>
                                    <PositionInfo houseInfo={this.houseInfo} rentInfo={rentInfo} />
                                </TabPane>
                                <TabPane key='3' tab='续约记录'>
                                    <RenewalRecord id={rentInfo.id} />
                                </TabPane>
                                <TabPane key='4' tab='扫码开门' style={{ display: "flex", justifyContent: "center" }}>
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




function FurnitureItem(props: { id: string, value: string; type: LANGUAGE_REFER, onChange?: React.ChangeEventHandler<HTMLInputElement>; }): JSX.Element
{
    const FindKey = (value: LANGUAGE_REFER) =>
    {
        return (
            Object.keys(LANGUAGE_REFER).find((key: string) =>
            {
                return (
                    //@ts-ignore
                    LANGUAGE_REFER[key] === value
                );
            })
        );
    };
    return (
        <div className='FurnitureItem'>
            <input type='checkbox' value={props.value} id={props.id} onChange={props.onChange} />
            <label htmlFor={props.id}>
                <img draggable='false' alt={props.type} src={`${CONST_HOST}/img/HInfoIcons/${FindKey(props.type)}IconNone.jpg`} />
                <img draggable='false' alt={props.type} src={`${CONST_HOST}/img/HInfoIcons/${FindKey(props.type)}Icon.jpg`} />
                {props.type}
            </label>
            <div className='StateIcon' style={{ justifyContent: "center" }}>
                <span />
            </div>
            <div className='StateIconError' style={{ justifyContent: "center" }}>
                <span />
            </div>
        </div>
    );
}

import { AlipayOutlined, LeftOutlined } from '@ant-design/icons';
import { Affix, Button, DatePicker, Divider, InputNumber, Select, Spin } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment, { Moment } from 'moment';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { HouseInfo } from '../../../interfaces/HouseListInterface';
import HouseStore from '../../../redux/HouseStore';
import HouseItem from '../HouseItem';
import Order from './Order';



const DisableDate = (current: Moment): boolean =>
{
    return (
        current && current < moment().startOf('day')
    );
};
declare interface ConfirmOrderProps extends RouteComponentProps
{

}
@observer
class ConfirmOrder extends Component<ConfirmOrderProps, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    @observable houseInfo: HouseInfo;
    order: Order = new Order();
    async componentDidMount()
    {
        const { hId } = this.props.match.params as { hId: string; };
        this.houseInfo = await this.HouseStore.InitHouseInfo(hId);
    }
    render()
    {
        const { houseInfo, order } = this;
        if (!houseInfo) return (<Spin size='large' style={{ position: "absolute", top: '40%', left: '50%', marginLeft: "-20px" }} />);
        return (
            <div className='ConfirmOrder'>
                <div className='OrderInfo'>
                    <div className='OrderInfo_Title'>
                        <Button
                            icon={<LeftOutlined />}
                            size='large'
                            type='link'
                            onClick={() =>
                            {
                                this.props.history.go(-1);
                            }}
                        />
                        <span>确定并支付</span>
                    </div>
                    <div className='OrderInfo_Content'>
                        <Divider orientation="left" className="DividerHouseInfo">您的行程</Divider>
                        <div className='OrderInfo_Content_Item'>
                            <div>
                                日期
                                <div>
                                    入住日期：
                                    <DatePicker
                                        locale={locale}
                                        disabledDate={DisableDate}
                                        value={order.checkInDate}
                                        clearIcon={null}
                                        onChange={(e) =>
                                        {
                                            if (!e) return;
                                            order.SetCheckIn(e);
                                        }}
                                    />
                                    月数：
                                    <InputNumber
                                        value={order.checkInMonth}
                                        style={{ width: '60px' }}
                                        min={1}
                                        onChange={(e) =>
                                        {
                                            this.order.SetCheckout(e);
                                        }}
                                    />
                                </div>
                            </div>
                            {order.checkInDate.format("YYYY年MM月DD日")}~{order.checkOutDate.format("YYYY年MM月DD日")}
                        </div>
                        <div className='OrderInfo_Content_Item'>
                            <div>
                                房客人数
                                <div>
                                    人数：
                                    <InputNumber
                                        value={order.tenantNum}
                                        style={{ width: '60px' }}
                                        min={1}
                                        max={4}
                                        onChange={(e) =>
                                        {
                                            order.tenantNum = e;
                                        }}
                                    />
                                </div>
                            </div>
                            {`${order.tenantNum}位房客`}
                        </div>
                        <Divider orientation="left" className="DividerHouseInfo">支付方式</Divider>
                        <Select size='large' defaultValue='1' style={{ width: '100%' }} >
                            <Select.Option value='1'>
                                <div>
                                    <AlipayOutlined style={{
                                        color: "white",
                                        backgroundColor: '#1890ff',
                                        boxSizing: "border-box",
                                        padding: "5px",
                                        fontSize: "30px",
                                        borderRadius: "10px"
                                    }} />
                                    <span>支付宝</span>
                                </div>
                            </Select.Option>
                        </Select>
                    </div>
                </div>

                <Affix offsetTop={30}>
                    <div className='OrderAmount'>
                        <HouseItem HouseInfo={houseInfo.baseInfo} />
                        <Divider orientation="left" className="DividerHouseInfo">价格详情</Divider>
                        <div className='OrderCharge'>

                        </div>
                    </div>
                </Affix>
            </div >
        );
    }
}


export default withRouter(ConfirmOrder);

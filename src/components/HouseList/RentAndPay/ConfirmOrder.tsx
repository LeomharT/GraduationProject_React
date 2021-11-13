import { AlipayOutlined, createFromIconfontCN, LeftOutlined, PayCircleOutlined } from '@ant-design/icons';
import { Affix, Button, Checkbox, DatePicker, Divider, Drawer, InputNumber, message, Modal, notification, Popover, Select, Spin } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment, { Moment } from 'moment';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import CashPayment from '../../../assets/img/CashPayment.gif';
import { HouseInfo } from '../../../interfaces/HouseListInterface';
import { AliPayOrderState, PayChannel } from '../../../interfaces/PaymentInterface';
import HouseStore from '../../../redux/HouseStore';
import UserStore from '../../../redux/UserStore';
import { CONST_HOST } from '../../Common/VariableGlobal';
import HouseItem from '../HouseItem';
import AddTenantInfo from './AddTenantInfo';
import Order from './Order';
import OrderRenewal from './OrderRenewal';
import OrderReserve from './OrderReserve';




const DisableDate = (current: Moment): boolean =>
{
    return (
        (current && current < moment().startOf('day')) || (current > moment().endOf('month'))
    );
};
export const IconFont = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/font_2860849_ddvr2vdqfme.js'
    ]
});
declare interface ConfirmOrderProps extends RouteComponentProps
{

}
@observer
class ConfirmOrder extends Component<ConfirmOrderProps, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    HouseStore: HouseStore = HouseStore.GetInstance();
    @observable houseInfo: HouseInfo;
    @observable isDrawerOpen: boolean = false;
    @observable paying: boolean = false;    //支付中,控制弹出框
    @observable checking: boolean = false;  //验证支付状态
    @observable isRenewal: boolean = false; //是续租还是预定
    order: Order;
    @observable payFully: boolean = true;
    @observable agreeProtocol: boolean = false;
    CloseDrawer = (): void =>
    {
        this.isDrawerOpen = false;
    };
    MakeOrder = async (): Promise<void> =>
    {
        if (!this.order.tenantInfo)
        {
            if (this.order instanceof OrderReserve)
            {
                notification.open({
                    message: "支付失败",
                    description: "请您输入入住人员身份信息",
                    type: "error",
                });
                return;
            }
        }
        const res = await (
            await (fetch(`${CONST_HOST}/OpenAliPayPage`, {
                method: "POST",
                body: JSON.stringify(this.order),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
            }))
        ).json();
        try
        {
            this.paying = true;
            message.loading('正在为您打开支付宝收银台');
            setTimeout(() =>
            {
                window.open(res);
            }, 2500);
        } catch (err: any)
        {
            throw new Error(err);
        }
    };
    CheckOrderPaymentStatus = async (): Promise<void> =>
    {
        const { order } = this;
        this.checking = true;
        const resURL = await (
            await fetch(`${CONST_HOST}/CheckOrderPaymentStatus`, {
                method: "POST",
                body: JSON.stringify(this.order),
                headers: {
                    'Content-Type': "application/json;charset=utf-8",
                }
            })
        ).text();//获取对象用.json() 获取字符串用.text()

        const res = await (await fetch(resURL)).json() as AliPayOrderState;
        if (res.alipay_trade_query_response.code === "10000" && res.alipay_trade_query_response.trade_status === 'TRADE_SUCCESS')
        {
            if (this.order instanceof OrderReserve)
            {
                const orderFormData = new FormData();
                orderFormData.set('uId', this.UserStore.authInfo?.userInfo?.id);
                orderFormData.set('hId', this.houseInfo.baseInfo.hId);
                orderFormData.set("orderId", res.alipay_trade_query_response.out_trade_no);
                orderFormData.set("buyer_user_id", res.alipay_trade_query_response.buyer_user_id);
                orderFormData.set("totalAmount", res.alipay_trade_query_response.total_amount);
                orderFormData.set('originAmount', res.alipay_trade_query_response.total_amount);
                orderFormData.set("sendPayDate", res.alipay_trade_query_response.send_pay_date);
                orderFormData.set('trade_no', res.alipay_trade_query_response.trade_no);
                orderFormData.set('checkInDate', moment(order.checkInDate).format('YYYY-MM-DD hh:mm:ss'));
                orderFormData.set('checkOutDate', moment(order.checkOutDate).format('YYYY-MM-DD hh:mm:ss'));
                const result = await (await fetch(`${CONST_HOST}/AddHouseToUser`, {
                    method: "POST",
                    body: orderFormData
                })).json();
                if (result.affectedRows >= 1)
                {
                    message.success('支付成功');
                    setTimeout(() =>
                    {
                        this.props.history.push("/User/UserRents");
                    }, 1500);
                } else
                {
                    message.error('出错了!如已经支付请联系客服');
                }
            }
            if (this.order instanceof OrderRenewal)
            {
                //@ts-ignore
                const { id, orderId, totalAmount } = this.props.location.state.urlState;
                const newTotalAmount = parseFloat(totalAmount) + parseFloat(res.alipay_trade_query_response.total_amount);
                const orderFormData = new FormData();
                orderFormData.set("id", id);
                orderFormData.set('hId', this.houseInfo.baseInfo.hId);
                orderFormData.set("oldOrderId", orderId);
                orderFormData.set("orderId", res.alipay_trade_query_response.out_trade_no);
                orderFormData.set("newTotalAmount", newTotalAmount.toString());
                orderFormData.set("totalAmount", res.alipay_trade_query_response.total_amount);
                orderFormData.set('trade_no', res.alipay_trade_query_response.trade_no);
                orderFormData.set("newCheckOutDate", this.order.checkOutDate.format('YYYY-MM-DD hh:mm:ss'));
                orderFormData.set('checkInDate', moment(order.checkInDate).format('YYYY-MM-DD hh:mm:ss'));
                orderFormData.set('checkOutDate', moment(order.checkOutDate).format('YYYY-MM-DD hh:mm:ss'));
                const result = await (await fetch(`${CONST_HOST}/RenewalOrder`, {
                    method: "POST",
                    body: orderFormData
                })).json();
                if (result.affectedRows >= 1)
                {
                    message.success('支付成功');
                    setTimeout(() =>
                    {
                        this.props.history.push("/User/UserRents");
                    }, 1500);
                } else
                {
                    message.error('出错了!如已经支付请联系客服');
                }
            }
        }
        setTimeout(() =>
        {
            this.paying = false;
            this.checking = false;
        }, 1500);
    };
    async componentDidMount()
    {
        const { state } = this.props.location;
        if (state)
        {
            //@ts-ignore
            this.order = new OrderRenewal(moment(state.urlState.checkOutDate));
            this.isRenewal = true;
        } else
        {
            this.order = new OrderReserve(moment(Date.now()));
        }
        const { hId } = this.props.match.params as { hId: string; };
        this.houseInfo = await this.HouseStore.InitHouseInfo(hId);
        this.order.housebaseInfo = this.houseInfo.baseInfo;
    }
    render()
    {
        const { houseInfo, order } = this;
        const CountTotalRent = (): string =>
        {
            const originRent = order.checkInMonth * parseInt(houseInfo.baseInfo.hRent);
            const serverRent = order.checkInMonth * parseInt(houseInfo.baseInfo.hRent) * 0.05;
            let discount: number = 0;
            if (houseInfo.baseInfo.hFeature.includes("首月免租"))
            {
                discount = parseInt(houseInfo.baseInfo.hRent);
            } else
            {
                discount = originRent - originRent * 0.8;
            }
            const finalRent = originRent + serverRent - discount;
            order.finalRent = finalRent;
            return finalRent.toString();
        };
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
                                        style={{ marginRight: "15px" }}
                                        disabled={this.isRenewal}
                                        locale={locale}
                                        disabledDate={DisableDate}
                                        value={order.checkInDate}
                                        clearIcon={null}
                                        showTime
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
                        <Select
                            size='large'
                            defaultValue={PayChannel.aliPay}
                            style={{ width: '100%' }}
                            onChange={(e: string) =>
                            {
                                if (e === PayChannel.wechatPay)
                                {
                                    message.warning('还没弄微信噢😄');
                                    return;
                                }
                                order.payChannel = e;
                            }}
                        >
                            <Select.Option value={PayChannel.aliPay}>
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
                            <Select.Option value={PayChannel.wechatPay}>
                                <div>
                                    <IconFont
                                        style={{
                                            color: "white",
                                            boxSizing: "border-box",
                                            padding: "5px",
                                            fontSize: "30px",
                                            borderRadius: "10px"
                                        }}
                                        type='icon-houserentweixinzhifu'
                                    />
                                    <span>微信支付</span>
                                </div>
                            </Select.Option>
                        </Select>
                        <div style={{
                            textDecoration: 'underline',
                            marginTop: "30px",
                            display: 'flex',
                            flexDirection: "row-reverse"
                        }}>
                            选择积分抵扣?
                        </div>
                        <Divider orientation="left" className="DividerHouseInfo">出行信息</Divider>
                        <div className='OrderInfo_Content_Item'>
                            <div>
                                房客信息
                                <div>
                                    <Button
                                        size='large'
                                        children={'编辑'}
                                        type='link'
                                        style={{ fontWeight: "bold" }}
                                        onClick={() =>
                                        {
                                            this.isDrawerOpen = true;
                                        }}
                                    />
                                    <Drawer
                                        title='添加信息'
                                        placement='left'
                                        visible={this.isDrawerOpen}
                                        onClose={this.CloseDrawer}
                                        width={378}
                                    >
                                        <AddTenantInfo order={this.order} CloseDrawer={this.CloseDrawer} />
                                    </Drawer>
                                </div>
                            </div>
                            {order.tenantInfo
                                ? `姓名:${order.tenantInfo.tenant_name} · 身份证:${order.tenantInfo.tenant_num}`
                                : ''
                            }
                        </div>
                        <Divider orientation="left" className="DividerHouseInfo">取消政策</Divider>
                        <div className='OrderInfo_Content_Item'>
                            {order.checkInDate.format("MM月DD日")}下午六点前取消,扣除{parseInt(houseInfo.baseInfo.hRent) * 0.05}元服务费后,退还剩余所有房费。
                        </div>
                        <Divider orientation="left" className="DividerHouseInfo">确认支付</Divider>
                        <div className='OrderInfo_Content_Item'>
                            <Checkbox checked={this.agreeProtocol} style={{ marginRight: "10px" }}
                                id='AgreeProtocol'
                                onChange={() =>
                                {
                                    this.agreeProtocol = !this.agreeProtocol;
                                }}
                            >
                            </Checkbox>
                            <label htmlFor='AgreeProtocol' style={{ cursor: 'pointer' }}>
                                点击按钮即代表我同意房东的<Button style={{ padding: '0' }} type='link' children='入住须知' size='large' />、优区生活针对新冠肺炎疫情的<Button style={{ padding: '0' }} type='link' children='安全要求' size='large' />和<Button style={{ padding: '0' }} type='link' children='房客退款政策' size='large' />。
                            </label>
                        </div>
                        <Button
                            onClick={async () =>
                            {
                                if (!this.agreeProtocol)
                                {
                                    message.error("请勾选同意条款");
                                    return;
                                }
                                await this.MakeOrder();
                            }}
                            size='large'
                            type='primary'
                            icon={<PayCircleOutlined />}
                            children={this.isRenewal ? '确认续约' : '立即支付并预定'}
                        />
                    </div>
                </div>

                <Affix offsetTop={30}>
                    <div className='OrderAmount'>
                        <HouseItem HouseInfo={houseInfo.baseInfo} />
                        <Divider orientation="left" className="DividerHouseInfo">价格详情</Divider>
                        <div className='OrderCharge'>
                            <div>
                                <span>
                                    &yen;{houseInfo.baseInfo.hRent}&times;{order.checkInMonth}月
                                </span>
                                <span>
                                    &yen;{parseInt(houseInfo.baseInfo.hRent) * order.checkInMonth}
                                </span>
                            </div>
                            <div>
                                <span style={{ textDecoration: "underline" }}>
                                    <Popover
                                        content={<div>
                                            服务费包括：物业费，宽带费，垃圾费，家电维修费
                                        </div>
                                        }>
                                        服务费
                                    </Popover>
                                </span>
                                <span>
                                    &yen;{parseInt(houseInfo.baseInfo.hRent) * 0.05 * order.checkInMonth}
                                </span>
                            </div>
                            {
                                houseInfo.baseInfo.hFeature.includes("首月免租")
                                    ? <div>
                                        <span style={{ textDecoration: "underline" }}>
                                            <Popover
                                                content={<div>
                                                    首月不要钱💴!!!
                                                </div>
                                                }>
                                                首月免租
                                            </Popover>
                                        </span>
                                        <span style={{ color: "#52c41a" }}>
                                            -&yen;{houseInfo.baseInfo.hRent}
                                        </span>
                                    </div>
                                    : <div>
                                        <span style={{ textDecoration: "underline" }}>
                                            <Popover
                                                content={<div>
                                                    用我的网站租房子打八折😄
                                                </div>
                                                }>
                                                网站特惠8折
                                            </Popover>
                                        </span>
                                        <span style={{ color: "#52c41a" }}>
                                            -&yen;{(parseInt(houseInfo.baseInfo.hRent) * order.checkInMonth) - (parseInt(houseInfo.baseInfo.hRent) * order.checkInMonth * 0.8)}
                                        </span>
                                    </div>
                            }
                            <div style={{ fontWeight: "bold" }}>
                                <span >
                                    {`总价(CYN)`}
                                </span>
                                <span style={{ color: "#52c41a" }}>
                                    &yen;{CountTotalRent()}
                                </span>
                            </div>
                        </div>
                    </div>
                </Affix>
                <Modal
                    className='PaymentNotification'
                    destroyOnClose={true}
                    maskClosable={false}
                    closable={false}
                    visible={this.paying}
                    centered
                    okText='支付成功👍'
                    cancelText='还没付呢😂'
                    cancelButtonProps={{
                        danger: true,
                        type: "primary",
                        size: "large",
                        loading: this.checking,
                    }}
                    okButtonProps={{
                        size: "large",
                        loading: this.checking,
                    }}
                    onOk={async () =>
                    {
                        await this.CheckOrderPaymentStatus();
                    }}
                    onCancel={async () =>
                    {
                        await this.CheckOrderPaymentStatus();
                    }}
                >
                    支付中请稍后
                    <Spin size='large' />
                    <div style={{ width: "472px", height: "472px" }}>
                        <img
                            alt='Paying'
                            src={CashPayment}
                            draggable={false}
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}


export default withRouter(ConfirmOrder);

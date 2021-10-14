import { AlipayOutlined, createFromIconfontCN, LeftOutlined, PayCircleOutlined } from '@ant-design/icons';
import { Affix, Button, DatePicker, Divider, Drawer, InputNumber, message, notification, Popover, Select, Spin } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment, { Moment } from 'moment';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { HouseInfo } from '../../../interfaces/HouseListInterface';
import HouseStore from '../../../redux/HouseStore';
import { CONST_HOST } from '../../Common/VariableGlobal';
import HouseItem from '../HouseItem';
import AddTenantInfo from './AddTenantInfo';
import Order, { PayChannel } from './Order';



const DisableDate = (current: Moment): boolean =>
{
    return (
        current && current < moment().startOf('day')
    );
};
export const IconFont = createFromIconfontCN({
    scriptUrl: [
        '//at.alicdn.com/t/font_2860849_0ogg4aa60rvg.js'
    ]
});
declare interface ConfirmOrderProps extends RouteComponentProps
{

}
@observer
class ConfirmOrder extends Component<ConfirmOrderProps, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    @observable houseInfo: HouseInfo;
    @observable isDrawerOpen: boolean = false;
    order: Order = new Order();
    CloseDrawer = (): void =>
    {
        this.isDrawerOpen = false;
    };
    MakeOrder = async (): Promise<void> =>
    {
        if (!this.order.tenantInfo)
        {
            notification.open({
                message: "支付失败",
                description: "请您输入入住人员身份信息",
                type: "error",
            });
            // return;
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
        console.log(res);
    };
    async componentDidMount()
    {
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
                            点击下方按钮即代表我同意房东的入住须知、优区生活针对新冠肺炎疫情的安全要求和房客退款政策。
                        </div>
                        <Button
                            onClick={async () => { await this.MakeOrder(); }}
                            size='large'
                            type='primary'
                            icon={<PayCircleOutlined />}
                            children='立即支付并预定'
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
            </div>
        );
    }
}


export default withRouter(ConfirmOrder);

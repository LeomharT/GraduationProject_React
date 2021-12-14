import { BulbOutlined, LeftOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, message, Spin } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { HouseInfo } from '../../../interfaces/HouseListInterface';
import { UserRentListItem } from '../../../interfaces/UserInferface';
import HouseStore from '../../../redux/HouseStore';
import UserStore from '../../../redux/UserStore';
import { SelfCheckBox } from '../../Common/AppIconTitle';
import { CONST_HOST, SpinStyle } from '../../Common/VariableGlobal';
import HouseItem from '../HouseItem';
import OrderRefund from './OrderRefund';

const ReasonUser = [
    '不想住了',
    '住不起了',
    '点错了',
    '没有用优惠',
    '选错日期',
];
const ReasonServer = [
    '服务太烂了',
    '和想的不一样',
    '退款理由1',
    '退款理由2',
    '退款理由3',
];
const ReasonOther = [
    '退款理由4',
    '退款理由5',
    '退款理由6',
    '退款理由7',
    '退款理由8',
];
interface RefundOrderProps extends RouteComponentProps
{

}

@observer
class RefundOrder extends Component<RefundOrderProps, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    UserStore: UserStore = UserStore.GetInstance();
    @observable houseInfo: HouseInfo;
    @observable rentInfo: UserRentListItem;
    @observable checking: boolean = false;
    OrderRefund = async () =>
    {
        const { rentInfo } = this;
        this.checking = true;
        //只有在入住时间之前才会退款
        if (moment(Date.now()) < moment(rentInfo.checkInDate))
        {
            const orderRefund = new OrderRefund(moment(rentInfo.checkInDate));
            orderRefund.tradeNo = rentInfo.trade_no;
            orderRefund.refundAmount = rentInfo.originAmount;
            orderRefund.renewalOrderList = await this.UserStore.InitRenewalOrderList(rentInfo.id);
            const resURL = await (await fetch(`${CONST_HOST}/OrderRefund`, {
                method: "POST",
                body: JSON.stringify(orderRefund),
                headers: {
                    'Content-Type': "application/json;charset=utf-8"
                },
            })).text();
            const refundInfo = await (await fetch(resURL)).json();
            console.log(refundInfo);
        }
        const uId = this.UserStore.GetCurrentUserId();
        if (!uId) return;
        const formData = new FormData();
        formData.set('id', rentInfo.id);
        formData.set("uId", uId);
        formData.set('hId', rentInfo.hId);
        formData.set('trade_no', rentInfo.trade_no);
        formData.set('orderId', rentInfo.orderId);
        const checkOutState = await (await fetch(`${CONST_HOST}/UserCheckOut`, {
            method: "POST",
            body: formData
        })).json();
        if (checkOutState.affectedRows >= 1)
        {
            message.success('退租成功', 1.5);
            setTimeout(() =>
            {
                this.props.history.go(-1);
            }, 1500);
        }
    };
    async componentDidMount()
    {
        let { rentInfo } = this.props.location.state as { rentInfo: UserRentListItem & string; };
        this.rentInfo = JSON.parse(rentInfo as string);
        this.houseInfo = await this.HouseStore.InitHouseInfo(this.rentInfo.hId);
    }
    render()
    {
        const { houseInfo } = this;
        if (!houseInfo) return (<Spin size='large' style={SpinStyle} />);
        return (
            <div className='RefundOrder'>
                <Alert
                    message="提示"
                    description='请认真阅读取消政策'
                    type="warning"
                    showIcon
                    icon={<BulbOutlined />}
                />
                <h1>
                    <Button type='link' icon={<LeftOutlined />}
                        onClick={() =>
                        {
                            this.props.history.go(-1);
                        }}
                    />
                    取消政策
                </h1>
                <Divider />
                <div className='RefundDescription'>
                    <span>极其严格</span>
                    <p>
                        在您的订单时间开始之前(入住之前)取消，可获得全额退款，包括其他所有费用。在您入住之后选择退房，<span style={{ color: "#fe615a" }}>已支付</span>的费用将不给予退还。
                    </p>
                    <div className='RefundRange'>
                        <div>
                            <Divider type='vertical' />
                            预定已确认
                            <p>在此期间取消预订可获全额退款，包括其他所有费用。</p>
                        </div>
                        <div>
                            <Divider type='vertical' />
                            旅程开始之前
                            <p>在此期间取消预订可获全额退款，包括其他所有费用。</p>
                        </div>
                        <div>
                            <Divider type='vertical' />
                            居住期间
                            <p>在这个阶段您的退房将<span style={{ color: "#fe615a" }}>不会收到任何退款。</span></p>
                        </div>
                    </div>
                </div>
                <Divider />
                <h1>其他条款</h1>
                <OtherRule />
                <h1>退房房屋</h1>
                <HouseItem HouseInfo={houseInfo.baseInfo} />
                <h1>退房理由</h1>
                <div className='RefundReason'>
                    <div>
                        <span>用户</span>
                        {ReasonUser.map((v: string) =>
                        {
                            return (
                                <SelfCheckBox key={v} id={v} label={v} color='#1890ff' />
                            );
                        })}
                    </div>
                    <div>
                        <span>服务</span>
                        {ReasonServer.map((v: string) =>
                        {
                            return (
                                <SelfCheckBox key={v} id={v} label={v} color='#13c2c2' />
                            );
                        })}
                    </div>
                    <div>
                        <span>其他</span>
                        {ReasonOther.map((v: string) =>
                        {
                            return (
                                <SelfCheckBox key={v} id={v} label={v} color='#722ed1' />
                            );
                        })}
                    </div>
                </div>
                <Divider />
                <Button children='退房' danger size='large' type='primary' loading={this.checking}
                    onClick={this.OrderRefund} />
            </div>
        );
    }
}

export default withRouter(RefundOrder);


function OtherRule()
{
    return (
        <div className='OtherRule'>
            <div>
                <span>截止时间为中午12点</span>
                我们将入住日期的房源当地时间中午12点视为旅程开始时间，无论房客实际预订的入住时间是什么时候。旅程开始之前的取消期限均根据您房源的当地时间中午12点这一截止时间进行计算。如果在旅程期间取消预订，取消预订的截止时间为房源当地时间中午12点。如果在任何一天的中午12点之后取消预订，取消预订的处罚可能会有所不同。
            </div>
            <div>
                <span>退还费用</span>
                如果发生各项政策所述的特定情况，房费和服务费将可以退还。如果在预订入住日期的房源当地时间中午12点之后取消预订，清洁费和优区生活服务费将不可退还。
            </div>
            <div>
                <span>税费</span>
                优区生活将会退还之前对房客退款所收取的税费，并向相关税务机构缴纳已取消预订中不可退款的部分所产生的税费。
            </div>
            <div>
                <span>最多3笔预订可全额退款</span>
                房客每12个月最多有3次机会可以在取消预订时获得全额退款。超过3次后，我们将不退还在此期间取消的任何其他预订的优区生活服务费。预订时，如果房客已获得全额退款和即将获得全额退款的预订总数已达3笔或超过3笔，则房客服务费也将不予退还。
            </div>
            <div>
                <span>房东或房源问题</span>
                如果房客遇到房东问题或房源问题，必须在入住后24小时内联系优区生活。如果该问题属于房客退款政策保障的范围，房客可能会有资格获得部分或全额退款。
            </div>
            <div>
                <span>与其他政策的关系</span>
                房客取消政策、特殊情况政策或者优区生活出于服务条款允许的其他原因取消预订均优先于房东的取消政策，而且对房东的取消政策有约束作用。
            </div>
            <div>
                <span>正式取消预订</span>
                房客按照优区生活网站上的取消预订页面中说明的步骤取消预订并收到取消确认后，预订才算正式被取消。房客可以在优区生活网站和应用中的您的行程一栏找到取消预订页面。
            </div>
            <div>
                <span>取消预订记录</span>
                房客提交预订申请时，房东可以看到该房客在此前12个月内取消的预订次数。
            </div>
            <div>
                <span>申请优区生活介入</span>
                对于房东和房客之间因这些取消政策的应用而产生的所有纠纷，优区生活拥有最终决定权。
            </div>
        </div>
    );
}

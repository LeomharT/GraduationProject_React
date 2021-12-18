import { BulbOutlined } from '@ant-design/icons';
import { Alert, Divider } from 'antd';
import React, { Component } from 'react';
import { OtherRule } from '../RentAndPay/RefundOrder';
export default class StaticRefund extends Component
{
    render()
    {
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
            </div>
        );
    }
}

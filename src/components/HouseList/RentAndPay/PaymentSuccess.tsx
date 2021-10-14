import { Button, Result } from 'antd';
import React, { Component } from 'react';
import PaymentSuccessfuly from '../../../assets/img/PaymentSuccessfuly.svg';
export default class PaymentSuccess extends Component
{
    render()
    {
        return (
            <Result
                icon={<img width='450px' alt='welcome' src={PaymentSuccessfuly} />}
                status='success'
                title="欢迎入住!请关闭此界面返回支付界面"
                extra={
                    <Button type="primary"

                    >
                        关闭此界面
                    </Button>
                }
            >
            </Result>
        );
    }
}

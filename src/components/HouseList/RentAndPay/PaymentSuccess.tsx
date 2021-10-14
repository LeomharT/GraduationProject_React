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
                title="欢迎入住!"
                extra={
                    <Button type="primary" size='large'>
                        这界面就是告诉你支付成功了,没什么用,你回去刚刚支付的界面好把😀
                    </Button>
                }
            >
            </Result>
        );
    }
}

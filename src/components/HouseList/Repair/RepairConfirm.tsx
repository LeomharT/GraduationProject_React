import { Button, Result } from 'antd';
import React, { Component } from 'react';
import RepairStore from '../../../redux/RepairStore';

export default class RepairConfirm extends Component
{
    RepairStore: RepairStore = RepairStore.GetInstance();
    render()
    {
        return (
            <div>
                <Result
                    status='success'
                    title='请确认您的报修信息'
                    subTitle={
                        <div>
                            订单信息
                        </div>
                    }
                    extra={
                        [
                            <Button children='上一步' onClick={this.RepairStore.Prev} />,
                            <Button children='确定' type='primary' />,
                        ]
                    }
                >

                </Result>
            </div>
        );
    }
}

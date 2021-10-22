import { PayCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Divider, Progress } from 'antd';
import React, { Component } from 'react';
import { UserRentListItem } from '../../../interfaces/UserInferface';
import { IconFont } from '../../HouseList/RentAndPay/ConfirmOrder';

export default class CostDetail extends Component<{ rentInfo: UserRentListItem; }, {}>
{
    render()
    {
        const { rentInfo } = this.props;
        return (
            <div className='CostDetail'>
                <div className='CostItem'>
                    <Button size='large' icon={<PayCircleOutlined />} type='primary' />
                    <span>房屋金额</span>
                    <Progress percent={20} size='default' />
                    <span>&yen;{rentInfo.totalAmount}.00</span>
                </div>
                <Divider />
                <div className='CostItem'>
                    <Button size='large' icon={<IconFont type='icon-houserentshuifei' />} type='primary' />
                    <span>水费</span>
                    <Progress percent={60} size='default' />
                    <span>&yen;5000.00</span>
                </div>
                <Divider />
                <div className='CostItem'>
                    <Button size='large' icon={<ThunderboltOutlined />} type='primary' />
                    <span>电费</span>
                    <Progress percent={40} size='default' />
                    <span>&yen;5000.00</span>
                </div>
                <Divider />
                <div className='CostItem'>
                    <Button size='large' icon={<IconFont type='icon-houserenttingchejiaofei' />} type='primary' />
                    <span>停车费</span>
                    <Progress percent={70} size='default' />
                    <span>&yen;5000.00</span>
                </div>
            </div>
        );
    }
}

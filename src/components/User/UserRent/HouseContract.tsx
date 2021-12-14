import { Divider } from 'antd';
import React, { Component } from 'react';
import { AppIconTitle } from '../../Common/AppIconTitle';

export default class HouseContract extends Component<{}, {}>
{
    render()
    {
        return (
            <div className='HouseContract'>
                <AppIconTitle title='优区生活' />
                <Divider />
                <p style={{ fontWeight: "bold" }}>本文件签署日期: 年 月 日</p>
                <h2 style={{ textAlign: 'center', fontWeight: "bold" }}>{'{房屋名称}'}房屋租赁合同</h2>
            </div>
        );
    }
}

import { Button, Result } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import RepairStore from '../../../redux/RepairStore';

export default class RepairConfirm extends Component
{
    RepairStore: RepairStore = RepairStore.GetInstance();
    render()
    {
        const { repairFormData } = this.RepairStore;
        return (
            <div className='RepairConfirm'>
                <Result
                    status='success'
                    title='请确认您的报修信息'
                    subTitle={
                        <table>
                            <tbody>
                                <tr>
                                    <th>报修房屋</th>
                                    <td>{repairFormData.repair_house}</td>
                                </tr>
                                <tr>
                                    <th>报修人</th>
                                    <td>{repairFormData.repair_name}</td>
                                </tr>
                                <tr>
                                    <th>预留电话</th>
                                    <td>{repairFormData.repair_phone}</td>
                                </tr>
                                <tr>
                                    <th>报修时间</th>
                                    <td>{moment(repairFormData.repair_time).format("YYYY-MM-DD hh:mm:ss")}</td>
                                </tr>
                                <tr>
                                    <th>故障项目</th>
                                    <td>{(JSON.parse(repairFormData.repair_item) as Array<string>).join(",")}</td>
                                </tr>
                                <tr>
                                    <th>故障描述</th>
                                    <td>{repairFormData.repair_detail}</td>
                                </tr>
                            </tbody>

                        </table>
                    }
                    extra={
                        [
                            <Button key='prev' children='上一步' onClick={this.RepairStore.Prev} />,
                            <Button key='next' children='确定' type='primary' />,
                        ]
                    }
                >

                </Result>
            </div>
        );
    }
}

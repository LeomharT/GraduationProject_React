import { Alert, Button, Result } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import RepairStore from '../../../redux/RepairStore';

export default class RepairConfirm extends Component
{
    RepairStore: RepairStore = RepairStore.GetInstance();
    ConfirmRepairOrder = () =>
    {
        Object.assign(this.RepairStore.repairFormData, {
            repair_time: moment(this.RepairStore.repairFormData.repair_time).format('YYYY/MM/DD hh:mm:ss')
        });
        console.log(JSON.stringify(this.RepairStore.repairFormData));
    };
    render()
    {
        const { repairFormData } = this.RepairStore;
        return (
            <div className='RepairConfirm'>
                <Result
                    status='success'
                    title='请确认您的报修信息'
                    subTitle={
                        [
                            <Alert key='alert' message={'若报修信息乱填将不给予服务'} type='warning' closable showIcon />,
                            <table key='table'>
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
                            </table>,
                        ]
                    }
                    extra={
                        [
                            <Button key='prev' children='上一步' onClick={this.RepairStore.Prev} />,
                            <Button key='next' children='确定' type='primary' onClick={() =>
                            {
                                this.ConfirmRepairOrder();
                            }} />,
                        ]
                    }
                >

                </Result>
            </div>
        );
    }
}
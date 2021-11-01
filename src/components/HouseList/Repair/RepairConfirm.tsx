import { Alert, Button, message, Result } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { OrderState } from '../../../interfaces/PaymentInterface';
import RepairStore from '../../../redux/RepairStore';
import { CONST_HOST } from '../../Common/VariableGlobal';
@observer
class RepairConfirm extends Component<RouteComponentProps, {}>
{
    RepairStore: RepairStore = RepairStore.GetInstance();
    @observable checking: boolean = false;
    ConfirmRepairOrder = async () =>
    {
        this.checking = true;
        const { repairFormData } = this.RepairStore;

        Object.assign(repairFormData, {
            repair_time: repairFormData.repair_time instanceof moment
                ? repairFormData.repair_time.format('YYYY-MM-DD hh:mm:ss')
                : repairFormData.repair_time,
            repair_state: OrderState.wating,
        });
        let res = await (await fetch(`${CONST_HOST}/AddRepairOrder`, {
            method: "POST",
            body: JSON.stringify(this.RepairStore.repairFormData),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        })).json();
        if (res.affectedRows >= 1)
        {
            message.success("报修添加成功");
            setTimeout(() =>
            {
                this.props.history.push('/User/RepairOrder');
            }, 1000);
        }
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
                            <Alert key='alert' message={'我们将会在[报修时间]内上门维系'} type='info' closable showIcon />,
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
                            <Button key='next' children='确定'
                                loading={this.checking}
                                type='primary' onClick={async () =>
                                {
                                    await this.ConfirmRepairOrder();
                                }} />,
                        ]
                    }
                >
                </Result>
            </div>
        );
    }
}
export default withRouter(RepairConfirm);

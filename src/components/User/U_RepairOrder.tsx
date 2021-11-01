import { Button, ConfigProvider, Space, Table, Tooltip } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { ColumnType } from 'antd/lib/table';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import { DefaultRecordType } from 'rc-table/lib/interface';
import React, { Component } from 'react';
import { RepairOrderFormData } from '../../interfaces/HouseListInterface';
import { OrderState } from '../../interfaces/PaymentInterface';
import UserStore from '../../redux/UserStore';
import { StateIcon } from '../Common/AppIconTitle';
import { CONST_HOST } from '../Common/VariableGlobal';

@observer
export default class U_RepairOrder extends Component<{}, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable repairList: RepairOrderFormData[] = [];
    COLUMNS: ColumnType<DefaultRecordType>[] = [
        {
            title: "房屋名称",
            dataIndex: "repair_house",
            key: "repair_house",
        },
        {
            title: "报修时间",
            dataIndex: "repair_time",
            key: "repair_time",
            render: (value: Date) => (moment(value).format('YYYY-MM-DD hh:mm:ss'))
        },
        {
            title: "报修项目",
            dataIndex: "repair_item",
            key: "repair_item",
            render: (value: string) => (<Tooltip placement='topLeft' title={value}>{value}</Tooltip>),
        },
        {
            title: "维修状态",
            dataIndex: "repair_state",
            key: "repair_state",
            render: (value: OrderState) => (<StateIcon state={value} />),
            filters: [
                { text: OrderState.wating, value: OrderState.wating },
                { text: OrderState.processing, value: OrderState.processing },
                { text: OrderState.close, value: OrderState.close },
                { text: OrderState.error, value: OrderState.error },
            ],
            onFilter: (value, record): boolean =>
            {
                return record.repair_state.includes(value);
            }
        },
        {
            title: "操作",
            dataIndex: "Actions",
            key: "Actions",
            render: (value, record: RepairOrderFormData | DefaultRecordType) =>
            {
                return (
                    <Space size='small'>
                        <Button type='link' children='完成' size='small' onClick={async () =>
                        {
                            await this.CompleteRepair(record.id);
                        }} />
                        <Button type='link' children='删除' danger size='small' onClick={async () =>
                        {
                            await this.DeleteRepair(record.id);
                        }} />
                    </Space>
                );
            },
        },
    ];
    InitRepairList = async (): Promise<void> =>
    {
        this.repairList = await (
            await fetch(`${CONST_HOST}/GetRepairOrders`, {
                method: "POST",
                body: JSON.stringify({ uId: this.UserStore.GetCurrentUserId() }),
                headers: {
                    'Content-Type': "application/json;charset=utf-8",
                }
            })
        ).json();
    };
    CompleteRepair = async (id: string) =>
    {
        let res = await (await fetch(`${CONST_HOST}/CompleteRepairOrder?id=${id}`)).json();
        if (res.affectedRows >= 1)
        {
            this.InitRepairList();
        }
    };
    DeleteRepair = async (id: string) =>
    {
        let res = await (await fetch(`${CONST_HOST}/DeleteRepairOrder?id=${id}`)).json();
        if (res.affectedRows >= 1)
        {
            this.InitRepairList();
        }
    };
    async componentDidMount()
    {
        await this.InitRepairList();
    }
    render()
    {
        return (
            <ConfigProvider locale={zhCN}>

                <Table
                    pagination={false}
                    columns={this.COLUMNS}
                    dataSource={this.repairList}
                    className='U_RepairOrder'
                    expandable={{
                        expandedRowRender: record => <p style={{ margin: '0' }}>{record.repair_detail}</p>
                    }}
                >
                </Table>
            </ConfigProvider>
        );
    }
}

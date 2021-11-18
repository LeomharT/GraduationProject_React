import { Button, message, Space, Tooltip } from 'antd';
import Table, { ColumnType } from 'antd/lib/table';
import moment from 'moment';
import { DefaultRecordType } from 'rc-table/lib/interface';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RepairOrderFormData } from '../../../interfaces/HouseListInterface';
import { OrderState } from '../../../interfaces/PaymentInterface';
import { StateIcon } from '../../Common/AppIconTitle';
import { CONST_HOST, DataRowState } from '../../Common/VariableGlobal';
import { SelectRepairListAction } from '../redux/Global/Global_Actions';
import { SelectRepairListSelector } from '../redux/Global/Global_Selectro';


export default function RepairManage()
{
    const COLUMNS: ColumnType<DefaultRecordType>[] = [
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
                        <Button type='link' children='工作中' size='small' onClick={async () =>
                        {
                            await ChangeState(OrderState.processing, record.id);
                        }} />
                        <Button type='link' style={{ color: "purple" }} children='异常' danger size='small' onClick={async () =>
                        {
                            await ChangeState(OrderState.error, record.id);

                        }} />
                        <Button type='link' children='关闭' danger size='small' onClick={async () =>
                        {
                            await ChangeState(OrderState.close, record.id);
                        }} />
                    </Space>
                );
            },
        },
    ];
    const selectRepairListSelector = useSelector(SelectRepairListSelector);
    const dispatch = useDispatch();
    const ChangeState = async (state: OrderState, id: number | string): Promise<void> =>
    {
        let res = await (
            await fetch(`${CONST_HOST}/UpdateRepairOrder?state=${state}&id=${id}`)
        ).json() as DataRowState;
        if (res.affectedRows >= 1)
        {
            message.success("更新成功");
        } else
        {
            message.error("出错了");
        }
        dispatch(SelectRepairListAction([]));
    };
    useEffect(() =>
    {
        dispatch(SelectRepairListAction([]));
    }, [dispatch]);
    return (
        <Table
            pagination={false}
            columns={COLUMNS}
            dataSource={selectRepairListSelector}
            expandable={{
                expandedRowRender: record => <p style={{ margin: '0' }}>{record.repair_detail}</p>
            }}
            style={{
                boxSizing: "border-box",
                padding: '20px'
            }}
        >
        </Table>
    );
}

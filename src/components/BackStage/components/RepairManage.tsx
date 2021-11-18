import { Button, Space, Tooltip } from 'antd';
import Table, { ColumnType } from 'antd/lib/table';
import moment from 'moment';
import { DefaultRecordType } from 'rc-table/lib/interface';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RepairOrderFormData } from '../../../interfaces/HouseListInterface';
import { OrderState } from '../../../interfaces/PaymentInterface';
import { StateIcon } from '../../Common/AppIconTitle';
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
                        <Button type='link' children='完成' size='small' onClick={async () =>
                        {
                        }} />
                        <Button type='link' children='异常' danger size='small' onClick={async () =>
                        {
                        }} />
                        <Button type='link' children='关闭' danger size='small' onClick={async () =>
                        {
                        }} />
                    </Space>
                );
            },
        },
    ];
    const selectRepairListSelector = useSelector(SelectRepairListSelector);
    const dispatch = useDispatch();
    useEffect(() =>
    {
        dispatch(SelectRepairListAction([]));
        console.log(1);
    }, [dispatch]);
    console.log(selectRepairListSelector);
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

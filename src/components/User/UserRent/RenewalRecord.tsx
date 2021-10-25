import Table, { ColumnType } from 'antd/lib/table';
import { observer } from 'mobx-react';
import moment from 'moment';
import { DefaultRecordType } from 'rc-table/lib/interface';
import React, { Component } from 'react';
import { OrderState } from '../../../interfaces/PaymentInterface';
import UserStore from '../../../redux/UserStore';
import { StateIcon } from '../../Common/AppIconTitle';

const TableColumns: ColumnType<DefaultRecordType>[] = [
    {
        title: "房屋名称",
        dataIndex: "hTitle",
        key: "hTitle",
    },
    {
        title: "房屋状态",
        dataIndex: "hState",
        key: "hState",
        render: (state: OrderState) =>
        {
            return <StateIcon state={state} />;
        },
    },
    {
        title: "续约订单",
        dataIndex: "orderId",
        key: "orderId",
    },
    {
        title: "订单金额",
        dataIndex: "totalAmount",
        key: "totalAmount",
        render: (totalAmount: string) =>
        {
            return `￥${totalAmount}`;
        },
    },
    {
        title: "起始时间",
        dataIndex: "checkInDate",
        key: "checkInDate",
        render: (checkInDate: string) =>
        {
            return moment(checkInDate).format("YYYY/MM/DD");
        },
    },
    {
        title: "结束时间",
        dataIndex: "checkOutDate",
        key: "checkOutDate",
        render: (checkOutDate: string) =>
        {
            return moment(checkOutDate).format("YYYY/MM/DD");
        },
    },
];
@observer
export default class RenewalRecord extends Component<{ id: string; }, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    async componentDidMount()
    {
        this.UserStore.renewalRecordList = await this.UserStore.InitRenewalOrderList(this.props.id);
    }
    render()
    {
        return (
            <div className='RenewalRecord'>
                <Table pagination={false} columns={TableColumns} dataSource={this.UserStore.renewalRecordList} />
            </div>
        );
    }
}

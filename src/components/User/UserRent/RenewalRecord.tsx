import Table, { ColumnType } from 'antd/lib/table';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import { DefaultRecordType } from 'rc-table/lib/interface';
import React, { Component } from 'react';
import { RenewalOrderRecord } from '../../../interfaces/UserInferface';
import { CONST_HOST } from '../../Common/VariableGlobal';
const TableColumns: ColumnType<DefaultRecordType>[] = [
    {
        title: "房屋编号",
        dataIndex: "hId",
        key: "hId",
    },
    {
        title: "房屋名称",
        dataIndex: "hTitle",
        key: "hTitle",
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
    @observable renewalRecordList: RenewalOrderRecord[] = [];
    InitRenewalOrderList = async () =>
    {
        let res = await (
            await fetch(`${CONST_HOST}/GetUserRenewalOrderList?id=${this.props.id}`)
        ).json() as RenewalOrderRecord[];
        this.renewalRecordList = res;
    };
    async componentDidMount()
    {
        await this.InitRenewalOrderList();
    }
    render()
    {
        return (
            <div className='RenewalRecord'>
                <Table pagination={false} columns={TableColumns} dataSource={this.renewalRecordList} />
            </div>
        );
    }
}

import { ColumnHeightOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Input, Menu, Modal, Table, Tag, Tooltip } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { ColumnType } from 'antd/lib/table';
import moment from 'moment';
import { DefaultRecordType } from 'rc-table/lib/interface';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HouseBaseInfo, HouseDetailInfo } from '../../../interfaces/HouseListInterface';
import { OrderState } from '../../../interfaces/PaymentInterface';
import { StateIcon } from '../../Common/AppIconTitle';
import { RenderTags } from '../../HouseList/HouseItem';
import { SelectHouseListAction } from '../redux/HouseMainTain/House_Actions';
import { SelectHouseListSelector } from '../redux/HouseMainTain/House_Selector';

export default function HouseMaintain()
{
    const [tableSize, settableSize] = useState<SizeType>('middle');
    const [showModal, setshowModal] = useState<boolean>(false);
    const [updateing, setupdateing] = useState<boolean>(false);
    const [updateData, setupdateData] = useState<HouseBaseInfo & HouseDetailInfo>({} as HouseBaseInfo & HouseDetailInfo);
    const selectHouseListSelector = useSelector(SelectHouseListSelector);
    const dispatch = useDispatch();
    const TABLECOLUMN: ColumnType<DefaultRecordType>[] = [
        {
            title: '房屋ID', dataIndex: 'hId', key: 'hId'
        },
        {
            title: '房屋名称', dataIndex: 'hTitle', key: 'hTitle'
        },
        {
            title: '房屋租金', dataIndex: 'hRent', key: 'hRent'
        },
        {
            title: '租赁方式', dataIndex: 'hMethod', key: 'hMethod'
        },
        {
            title: '房屋状态', dataIndex: 'hState', key: 'hState',
            render: (state: OrderState) =>
            {
                return (<StateIcon state={state} />);
            },
        },
        {
            title: "房屋标签", dataIndex: "hTags", key: "hTags",
            render: (value: string) =>
            {
                return RenderTags(value.split(','));
            },
        },
        {
            title: "房屋特色", dataIndex: "hFeature", key: "hFeature",
            render: (value: string) =>
            {
                return (
                    value.split(",").map((f: string) =>
                    {
                        return (
                            <Tag key={f} color='default' style={{ height: "30px", lineHeight: "30px" }}>{f}</Tag>
                        );
                    })

                );
            },
        },
        {
            title: '维护时间', dataIndex: 'Maintain', key: 'Maintain',
            render: (value: Date) =>
            {
                return (moment(value).format("YYYY年MM月DD日 hh:mm:ss"));
            }
        },
        {
            title: "操作", dataIndex: "options", key: "options",
            render: (value, record, index) =>
            {
                return (
                    <Button children='配置' type='link' onClick={(e) =>
                    {
                        setshowModal(true);
                        setupdateData(record as HouseBaseInfo & HouseDetailInfo);
                    }} />
                );
            }
        },
    ];
    useEffect(() =>
    {
        dispatch(SelectHouseListAction([]));
    }, [dispatch]);
    return (
        <div className='HouseMaintain'>
            <div className='TableOptions'>
                <Tooltip title='设置'>
                    <Button icon={<SettingOutlined />} type='text' />
                </Tooltip>
                <Tooltip title='密度'>
                    <Dropdown overlay={
                        <Menu onClick={(e) =>
                        {
                            switch (e.key)
                            {
                                case "1":
                                    settableSize('large');
                                    break;
                                case "2":
                                    settableSize('middle');
                                    break;
                                case "3":
                                    settableSize('small');
                                    break;
                                default:
                                    return;
                            }
                        }}>
                            <Menu.Item key='1'>默认&nbsp;&nbsp;&nbsp;&nbsp;</Menu.Item>
                            <Menu.Item key='2'>中等&nbsp;&nbsp;&nbsp;&nbsp;</Menu.Item>
                            <Menu.Item key='3'>紧凑&nbsp;&nbsp;&nbsp;&nbsp;</Menu.Item>
                        </Menu>
                    }>
                        <Button icon={<ColumnHeightOutlined />} type='text' />
                    </Dropdown>
                </Tooltip>
                <Tooltip title='刷新'>
                    <Button icon={<ReloadOutlined />} type='text' onClick={() =>
                    {
                        dispatch(SelectHouseListAction([]));
                    }} />
                </Tooltip>
            </div>
            <Table
                columns={TABLECOLUMN}
                size={tableSize}
                dataSource={selectHouseListSelector}
            >

            </Table>
            <Modal
                confirmLoading={updateing}
                centered
                visible={showModal}
                onCancel={() => { setshowModal(false); }}
                footer={null}
                title={`维护${updateData.hTitle}`}
            >
                <div className='UpdateHouseListDataPanel'>
                    <Form onFinish={(e: HouseBaseInfo & HouseDetailInfo) =>
                    {
                        setupdateing(true);
                        console.log(e);
                        setupdateing(false);
                    }} layout='vertical'>
                        <Form.Item
                            label='房屋名称:'
                            name='hTitle'
                            initialValue={updateData.hTitle}
                            rules={[{ required: true, message: "请输入房屋名称" }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='租赁方式:'
                            name='hMethod'
                            initialValue={updateData.hTitle}
                            rules={[{ required: true, message: "请选择租赁方式" }]}>
                            <Input />
                        </Form.Item>




                        <Form.Item>
                            <div style={{ width: "100%", display: "flex", flexDirection: "row-reverse" }}>

                                <Button loading={updateing} children='取消' onClick={() =>
                                {
                                    setshowModal(false);
                                }} />
                                <Button loading={updateing} htmlType='submit' children='确定' type='primary' style={{ marginRight: "20px" }} />
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div >
    );
}

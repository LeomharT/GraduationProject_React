import { ColumnHeightOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, FormInstance, Input, InputNumber, Menu, message, Modal, Select, Table, Tag, Tooltip } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { ColumnType } from 'antd/lib/table';
import moment from 'moment';
import { DefaultRecordType } from 'rc-table/lib/interface';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HouseBaseInfo, HouseDetailInfo } from '../../../interfaces/HouseListInterface';
import { OrderState } from '../../../interfaces/PaymentInterface';
import { RepairItem, StateIcon } from '../../Common/AppIconTitle';
import { CONST_HOST, DataRowState, LANGUAGE_REFER } from '../../Common/VariableGlobal';
import { RenderTags } from '../../HouseList/HouseItem';
import { SelectHouseListAction } from '../redux/Global/Global_Actions';
import { SelectHouseListSelector } from '../redux/Global/Global_Selectro';


export default function HouseMaintain()
{
    const [tableSize, settableSize] = useState<SizeType>('middle');
    const [showModal, setshowModal] = useState<boolean>(false);
    const [updateing, setupdateing] = useState<boolean>(false);
    const [updateData, setupdateData] = useState<HouseBaseInfo & HouseDetailInfo>({} as HouseBaseInfo & HouseDetailInfo);
    const selectHouseListSelector = useSelector(SelectHouseListSelector);
    const dispatch = useDispatch();
    const formRef: RefObject<FormInstance> = useRef<FormInstance>(null);
    const mapEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    let map: any = undefined;
    let marker: any = undefined;
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
                if (!value) return;
                return RenderTags(value.split(','));
            },
        },
        {
            title: "房屋特色", dataIndex: "hFeature", key: "hFeature",
            render: (value: string) =>
            {
                if (!value) return;
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
                        setTimeout(() =>
                        {
                            map = new TMap.Map(mapEl.current, {
                                center: new TMap.LatLng(record.hLatitude, record.hLongitude),
                                zoom: 18,
                                pitch: 43.5,
                                rotation: 45,
                                viewMode: "2D"
                            });
                            marker = new TMap.MultiMarker({
                                map: map,
                                styles: {
                                    marker: new TMap.MarkerStyle({
                                        width: 20,
                                        height: 30,
                                        anchor: { x: 10, y: 30 },
                                        src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png', // 标记路径
                                    }),
                                },
                                geometries: [
                                    {
                                        position: new TMap.LatLng(record.hLatitude, record.hLongitude),
                                    },
                                ],
                            });
                            map.on('click', (e: any) =>
                            {
                                const obj = {
                                    hLatitude: e.latLng.getLat().toFixed(6),
                                    hLongitude: e.latLng.getLng().toFixed(6)
                                };
                                formRef.current!.setFieldsValue({ ...obj });
                                marker.setGeometries([]);
                                marker.add({
                                    position: new TMap.LatLng(formRef.current!.getFieldValue('hLatitude'),
                                        formRef.current!.getFieldValue('hLongitude')),
                                });
                            });
                        }, 1000);
                    }} />
                );
            }
        },
    ];
    const UpDateHouse = async (data: HouseBaseInfo & HouseDetailInfo) =>
    {
        let res = await (await (fetch(`${CONST_HOST}/UpdateHouseDetail`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": 'application/json;charset=utf-8',
            }
        }))).json() as DataRowState;
        if (res.affectedRows >= 1)
        {
            message.success("更新成功了");
        }
    };
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
                destroyOnClose={true}
                confirmLoading={updateing}
                centered
                visible={showModal}
                onCancel={() =>
                {
                    setshowModal(false);
                    map = null;
                    marker = null;
                }}
                footer={null}
                title={`维护${updateData.hTitle}`}
            >
                <div className='UpdateHouseListDataPanel'>
                    <Form ref={formRef} onFinish={async (e: HouseBaseInfo & HouseDetailInfo) =>
                    {
                        setupdateing(true);
                        await UpDateHouse(e);
                        setupdateing(false);
                        setshowModal(false);
                        dispatch(SelectHouseListAction([]));
                    }} layout='vertical'>
                        <Form.Item name='hId' initialValue={updateData.hId} style={{ display: 'none' }} >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label='房屋名称:'
                            name='hTitle'
                            initialValue={updateData.hTitle}
                            rules={[{ required: true, message: "请输入房屋名称" }]}>
                            <Input autoComplete='off' />
                        </Form.Item>
                        <Form.Item
                            label='租赁方式:'
                            name='hMethod'
                            initialValue={updateData.hMethod}
                            rules={[{ required: true, message: "请选择租赁方式" }]}>
                            <Select>
                                <Select.Option value={'整租'} title={'整租'} children={'整租'} />
                                <Select.Option value={'合租'} title={'合租'} children={'合租'} />
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label='房屋租金'
                            name='hRent'
                            initialValue={updateData.hRent}
                            rules={[{ required: true, message: "请输入租金" }]}>
                            <InputNumber
                                style={{ width: "100%" }}
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                        <label>配套设施:</label>
                        <div className='AlterFacility'>
                            {Object.keys(LANGUAGE_REFER).map((key: string) =>
                            {
                                return (
                                    <Form.Item
                                        style={{ marginBottom: "0" }}
                                        key={key}
                                        name={`is${key}`}
                                        initialValue={updateData[`is${key}`]}
                                    >
                                        <RepairItem
                                            id={key}
                                            key={key}
                                            //@ts-ignore
                                            value={LANGUAGE_REFER[key]}
                                            //@ts-ignore
                                            type={LANGUAGE_REFER[key]}
                                            checked={updateData[`is${key}`]}
                                            onChange={(e) =>
                                            {
                                                let obj = {} as any;
                                                if (e.target.checked)
                                                {
                                                    //@ts-ignore
                                                    obj[`is${key}`] = 1;
                                                } else
                                                {
                                                    //@ts-ignore
                                                    obj[`is${key}`] = 0;
                                                }
                                                formRef.current!.setFieldsValue(obj);
                                                const copyObj = { ...updateData };
                                                Object.assign({ ...copyObj, }, obj);
                                                setupdateData(Object.assign({ ...updateData, }, obj));
                                            }}
                                        />
                                    </Form.Item>
                                );
                            })}
                        </div>
                        <Form.Item label='房屋特点:'
                            tooltip='多个请用逗号隔开最后一个不要加'
                            name='hFeature'
                            initialValue={updateData.hFeature}
                            rules={[{ required: true, message: "请输入房屋特点" }]}
                        >
                            <Input />
                        </Form.Item>
                        <label>重新定位:</label>
                        <div ref={mapEl} className='SetHousePosition' id='SetHousePosition' />
                        <Form.Item initialValue={updateData.hLatitude} name='hLatitude'
                            style={{ display: 'none' }}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item initialValue={updateData.hLongitude} name='hLongitude'
                            style={{ display: 'none' }}
                        >
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

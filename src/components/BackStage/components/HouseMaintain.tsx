import { ColumnHeightOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Table, Tooltip } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SelectHouseListSelector } from '../redux/HouseMainTain/House_Selector';

export default function HouseMaintain()
{
    const [tableSize, settableSize] = useState<SizeType>('middle');
    const selectHouseListSelector = useSelector(SelectHouseListSelector);
    const dispatch = useDispatch();
    useEffect(() =>
    {
        // dispatch({ type: HouseListEnum.SELECT });
    }, [dispatch]);
    console.log(selectHouseListSelector.length);
    return (
        <div className='HouseMaintain'>
            <div className='TableOptions'>
                <Tooltip title='刷新'>
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
                <Tooltip title='设置'>
                    <Button icon={<ReloadOutlined />} type='text' />
                </Tooltip>
            </div>
            <Table
                size={tableSize}
            >

            </Table>
        </div >
    );
}

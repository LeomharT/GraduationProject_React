import { BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../../assets/img/UserBackground_01.gif';
import { FoldAside, UnFoldAside } from './redux/Global/Global_Actions';
import { IsAsideFoldedSelector } from './redux/Global/Global_Selectro';
export default function Headers()
{
    const isFolded = useSelector(IsAsideFoldedSelector);
    const dispatch = useDispatch();
    return (
        <header className='Headers'>
            <Button size='large' icon={isFolded ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} type="text" onClick={e =>
            {
                isFolded
                    ? dispatch(UnFoldAside())
                    : dispatch(FoldAside());
            }} />
            <div className='HeadersOptions'>
                <Button icon={<SearchOutlined />} type='link' />
                <Button icon={<QuestionCircleOutlined />} type='link' />
                <Button icon={<BellOutlined />} type='link' />
                <div>
                    <Avatar size='small' src={avatar} style={{ marginRight: "10px" }} />
                    Admin
                </div>
            </div>

        </header>
    );
}

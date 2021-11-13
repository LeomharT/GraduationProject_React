import { MenuFoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FoldAside, UnFoldAside } from './redux/Global/Global_Actions';
import { IsAsideFoldedSelector } from './redux/Global/Global_Selectro';
export default function Headers()
{
    const isFolded = useSelector(IsAsideFoldedSelector);
    const dispatch = useDispatch();
    return (
        <header className='Headers'>
            <Button icon={<MenuFoldOutlined />} type="text" onClick={e =>
            {
                isFolded
                    ? dispatch(UnFoldAside())
                    : dispatch(FoldAside());
            }} />
        </header>
    );
}

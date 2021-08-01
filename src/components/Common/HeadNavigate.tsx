import { HomeOutlined } from '@ant-design/icons';
import React, { Component } from 'react';
import '../../assets/scss/Common.scss';
export default class HeadNavigate extends Component<{}, {}>
{
    render()
    {
        return (
            <div className="HeadNavi">
                <HomeOutlined color={'#ffffff'} />
            </div>
        );
    }
}

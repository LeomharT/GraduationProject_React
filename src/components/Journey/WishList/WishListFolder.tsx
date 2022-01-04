import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import HeadNavigate from '../../Common/HeadNavigate';

export default class WishListFolder extends Component<RouteComponentProps, {}>
{
    render()
    {
        return (
            <div className='WishListFolder'>
                <HeadNavigate />
                <div className='FolderList'>

                </div>
            </div>
        );
    }
}

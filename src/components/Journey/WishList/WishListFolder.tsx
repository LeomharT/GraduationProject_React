import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import UserStore from '../../../redux/UserStore';
import HeadNavigate from '../../Common/HeadNavigate';
import FolderItem from './FolderItem';

class WishListFolder extends Component<RouteComponentProps, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    componentDidMount(): void
    {
        const uID = this.UserStore.GetCurrentUserId();
    }
    render()
    {
        return (
            <div className='WishListFolder'>
                <HeadNavigate />
                <h1 style={{ fontSize: "30px", fontWeight: "bold", padding: "0 80px", paddingTop: "20px" }}>
                    心愿单
                </h1>
                <div className='FolderList'>
                    <FolderItem folderID='0' folderName='默认合集' />
                </div>
            </div>
        );
    }
}



export default withRouter(WishListFolder);

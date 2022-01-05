import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import HeadNavigate from '../../Common/HeadNavigate';
class WishListFolder extends Component<RouteComponentProps, {}>
{
    render()
    {
        return (
            <div className='WishListFolder'>
                <HeadNavigate />
                <div className='FolderList'>
                    <FolderItem />
                </div>
            </div>
        );
    }
}


class FolderItem extends Component<{}, {}>
{
    render(): React.ReactNode
    {
        return (
            <div className='FolderItem'>
                <div className='FolderLeft'>

                </div>
                <div className='FolderRight'>
                    <div>

                    </div>
                    <div>

                    </div>
                </div>
            </div>
        );
    }
};

export default withRouter(WishListFolder);

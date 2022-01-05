import { CheckCircleOutlined, EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Input } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import FolderEmpty from '../../../assets/img/Folder-Empty.gif';
import UserStore from '../../../redux/UserStore';
import HeadNavigate from '../../Common/HeadNavigate';

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

interface FolderItemProps
{
    FolderExhibit?: any[];
    folderID: string,
    folderName: string,
}
@observer
class FolderItem extends Component<FolderItemProps, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable editing: boolean = false;
    render(): React.ReactNode
    {
        return (
            <Card className='FolderItem'
                actions={
                    [
                        <SettingOutlined disabled />,
                        this.editing
                            ? <CheckCircleOutlined key="edit" onClick={() =>
                            {
                                this.editing = !this.editing;
                            }} />
                            : <EditOutlined key="edit" onClick={() =>
                            {
                                this.editing = !this.editing;
                            }} />,
                        <EllipsisOutlined key="ellipsis" />,
                    ]
                }
                cover={
                    <div className='FolderCover'>
                        {
                            this.props.FolderExhibit
                                ? <>
                                    <div className='FolderLeft'>
                                        <img alt='Empty' src={FolderEmpty} />
                                    </div>
                                    <div className='FolderRight'>
                                        <div>
                                            <img alt='Empty' src={FolderEmpty} />
                                        </div>
                                        <div>
                                            <img alt='Empty' src={FolderEmpty} />
                                        </div>
                                    </div>
                                </>
                                : <img alt='Empty' src={FolderEmpty} />
                        }

                    </div>
                }
            >
                <Card.Meta title={
                    this.editing ? <Input size='small' /> : "默认文件夹"
                }
                    description={"创建于:" + moment(this.UserStore.authInfo?.userInfo?.createdAt as Date).format('YYYY年MM月DD日 hh时mm分ss秒')} />
            </Card>
        );
    }
};

export default withRouter(WishListFolder);

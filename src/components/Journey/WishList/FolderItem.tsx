import { CheckOutlined, EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Input } from "antd";
import { observable } from "mobx";
import { observer } from "mobx-react";
import moment from "moment";
import { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import FolderEmpty from '../../../assets/img/Folder-Empty.gif';
import UserStore from "../../../redux/UserStore";

interface FolderItemProps extends RouteComponentProps
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
                            ? <CheckOutlined key="edit" onClick={(e) =>
                            {
                                if (this.props.folderID === '0')
                                {
                                    e.preventDefault();
                                    return;
                                }
                                this.editing = !this.editing;
                            }} />
                            : <EditOutlined key="edit" onClick={(e) =>
                            {
                                if (this.props.folderID === '0')
                                {
                                    e.preventDefault();
                                    return;
                                }
                                this.editing = !this.editing;
                            }} />,
                        <EllipsisOutlined key="ellipsis" onClick={e =>
                        {
                            this.props.history.push('/UserCollection/0');
                        }} />,
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
export default withRouter(FolderItem);

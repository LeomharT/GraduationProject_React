import { AuditOutlined, FormOutlined, ReadOutlined, ToolOutlined } from '@ant-design/icons';
import { Avatar, Menu, message } from 'antd';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { MenuType } from '../../interfaces/HomeInterface';
import AuthStore from '../../redux/AuthStore';
import UserStore from '../../redux/UserStore';

const UserNaviMenu: MenuType[] = [
    { title: "我的租约", link: "/User/UserRents", icon: <AuditOutlined /> },
    { title: "编辑资料", link: "/User/EditUserInfo", icon: <FormOutlined /> },
    { title: "我的文章", link: "/User/ArticleManage", icon: <ReadOutlined /> },
    { title: "我的报修", link: "/User/RepairOrder", icon: <ToolOutlined /> },
];
enum MenuIndex
{
    UserCollection = 'UserCollection',
    UserRents = 'UserRents',
    EditUserInfo = 'EditUserInfo',
    ArticleManage = 'ArticleManage',
    RepairOrder = 'RepairOrder',
}
@observer
class SideNavi extends Component<RouteComponentProps, {}>
{
    AuthStore: AuthStore = AuthStore.GetInstance();
    UserStore: UserStore = UserStore.GetInstance();
    SelectMenuItemByURL = (): string =>
    {
        const { pathname } = this.props.location;
        const currentCompontent = pathname.substr(pathname.lastIndexOf("/") + 1);
        switch (currentCompontent)
        {
            case MenuIndex.UserRents:
                return '0';
            case MenuIndex.EditUserInfo:
                return '1';
            case MenuIndex.ArticleManage:
                return '2';
            case MenuIndex.RepairOrder:
                return '3';
            default:
                return '';
        }

    };
    render()
    {
        return (
            <div className='SideNavi'>
                <div className="Avatar"
                    onClick={() =>
                    {
                        if (!this.UserStore.authenticationClient) return;
                        this.UserStore.authenticationClient.uploadAvatar().then((userInfo) =>
                        {
                            this.UserStore.authInfo.userInfo = userInfo;
                            message.success("上传成功");
                        });
                    }}
                >
                    <Avatar shape='square' size={64}
                        src={this.UserStore.authInfo.userInfo
                            ? this.UserStore.authInfo.userInfo.photo
                            : 'https://files.authing.co/authing-console/default-user-avatar.png'
                        }
                    />
                </div>
                <span>
                    {this.UserStore.RenderUserName()}
                </span>
                <Menu mode='inline'
                    defaultSelectedKeys={[this.SelectMenuItemByURL()]}
                    style={{ width: "200px" }}
                >
                    {UserNaviMenu.map((menu: MenuType, index: number) =>
                    {
                        return (
                            <Menu.Item key={index} icon={menu.icon}>
                                <Link to={menu.link}> {menu.title}</Link>
                            </Menu.Item>
                        );
                    })}
                </Menu>
            </div>
        );
    }
}
export default withRouter(SideNavi);

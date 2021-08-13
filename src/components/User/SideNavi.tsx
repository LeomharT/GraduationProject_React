import { AuditOutlined, FormOutlined, TagOutlined } from '@ant-design/icons';
import { Avatar, Menu, message } from 'antd';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MenuType } from '../../interfaces/HomeInterface';
import AuthStore from '../../redux/AuthStore';
import UserStore from '../../redux/UserStore';

const UserNaviMenu: MenuType[] = [
    { title: "关注的房源", link: "/User/UserCollection", icon: <TagOutlined /> },
    { title: "我的委托", link: "/User/UserRents", icon: <AuditOutlined /> },
    { title: "编辑资料", link: "/User/EditUserInfo", icon: <FormOutlined /> }
];

@observer
export default class SideNavi extends Component<{}, {}>
{
    AuthStore: AuthStore = AuthStore.GetInstance();
    UserStore: UserStore = UserStore.GetInstance();
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
                    defaultSelectedKeys={[(UserNaviMenu.length - 1).toString()]}
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

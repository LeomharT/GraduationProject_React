import { HomeOutlined, MoneyCollectOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MenuType } from '../../interfaces/HomeInterface';
import AuthStore from '../../redux/AuthStore';
import UserStore from '../../redux/UserStore';


const menuItem: MenuType[] = [
    { title: '租房', link: '/HouseList/Exhibits', icon: <HomeOutlined /> },
    { title: '出租', link: '/HouseRental', icon: <MoneyCollectOutlined /> },
];

@observer
export default class Navigate extends Component<{}, {}>
{
    AuthStore: AuthStore = AuthStore.GetInstance();
    UserStore: UserStore = UserStore.GetInstance();
    render()
    {
        return (
            <div className="HomeNavegate">
                <i />
                <div>
                    <Menu mode='horizontal' style={{ backgroundColor: 'rgba(0,0,0,0)', borderBottom: "none" }}>
                        {menuItem.map((item: MenuType) =>
                        {
                            return (
                                <Menu.Item icon={item.icon} key={item.title}>
                                    <Link to={item.link}>
                                        {item.title}
                                    </Link>
                                </Menu.Item>
                            );
                        })}
                        <Menu.Item
                            key={'Login'}
                            icon={<UserOutlined />}
                        >
                            <Link to="/User/EditUserInfo">
                                {
                                    this.UserStore.RenderUserName()
                                }
                            </Link>
                        </Menu.Item>
                    </Menu>
                    <Avatar
                        size={46}
                        shape='circle'
                        src={
                            this.UserStore.authInfo.userInfo
                                ? this.UserStore.authInfo.userInfo.photo
                                : 'https://files.authing.co/authing-console/default-user-avatar.png'
                        }
                    />
                </div>
            </div>
        );
    }
}

import { AuditOutlined, FormOutlined, TagOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MenuType } from '../../interfaces/HomeInterface';

export default class SideNavi extends Component<{}, {}>
{
    UserNaviMenu: MenuType[] = [
        { title: "关注的房源", link: "/User/UserCollection", icon: <TagOutlined /> },
        { title: "我的委托", link: "/User/UserRents", icon: <AuditOutlined /> },
        { title: "编辑资料", link: "/User/EditUserInfo", icon: <FormOutlined /> }
    ];
    render()
    {
        return (
            <div className='SideNavi'>
                <div className="Avatar">
                    <Avatar shape='square' size={64} icon={<UserOutlined />} />
                </div>
                <span>UserName</span>
                <Menu mode='inline'
                    defaultSelectedKeys={[(this.UserNaviMenu.length - 1).toString()]}
                    style={{ width: "200px" }}
                >
                    {this.UserNaviMenu.map((menu: MenuType, index: number) =>
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

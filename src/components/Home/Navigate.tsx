import { HomeOutlined, MoneyCollectOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MenuType } from './HomeInterface';



export default class Navigate extends Component<{}, {}>
{
    menuItem: MenuType[] = [
        { title: '租房', link: '/HomeList', icon: <HomeOutlined /> },
        { title: '出租', link: '/HouseRental', icon: <MoneyCollectOutlined /> },
        { title: '登录/注册', link: '/Login', icon: <UserOutlined /> },
    ];
    render()
    {
        return (
            <div className="HomeNavegate">
                <Menu mode='horizontal' style={{ backgroundColor: 'rgba(0,0,0,0)', borderBottom: "none" }}>
                    {this.menuItem.map((item: MenuType) =>
                    {
                        return (
                            <Menu.Item icon={item.icon} key={item.title}>
                                <Link to={item.link}>
                                    {item.title}
                                </Link>
                            </Menu.Item>
                        );
                    })}
                </Menu>
            </div>
        );
    }
}

import { HeartOutlined, HomeOutlined, MoneyCollectOutlined, UserOutlined, YahooOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DefaultAvatar from '../../assets/img/DefaultAvatar.png';
import { MenuType } from '../../interfaces/HomeInterface';
import AuthStore from '../../redux/AuthStore';
import UserStore from '../../redux/UserStore';
import { AppIconTitle } from '../Common/AppIconTitle';
import { IconFont } from '../HouseList/RentAndPay/ConfirmOrder';


const menuItem: MenuType[] = [
    { title: '浏览房源', link: '/HouseList/Exhibits', icon: <HomeOutlined /> },
    { title: '成为房东', link: '/HouseRental', icon: <MoneyCollectOutlined /> },
    { title: '心愿单', link: '/UserCollection', icon: <HeartOutlined /> },
    { title: '行程', link: '/Journey', icon: <IconFont type='icon-houserentlishihangcheng' /> },
    { title: "You+社区", link: '/Community', icon: <YahooOutlined /> },
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
                <AppIconTitle title='优区生活' />
                <div>
                    <Menu mode='horizontal' style={{ backgroundColor: 'rgba(0,0,0,0)', borderBottom: "none" }}>
                        {menuItem.map((item: MenuType) =>
                        {
                            return (
                                <Menu.Item icon={item.icon} key={item.title}>
                                    <Link to={item.link}
                                        onClick={(e: React.MouseEvent) =>
                                        {
                                            if (item.title === '心愿单' || item.title === '行程')
                                            {
                                                if (!this.UserStore.CheckForIsLogin())
                                                {
                                                    e.preventDefault();
                                                }
                                            }
                                        }}
                                    >
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
                                : DefaultAvatar
                        }
                    />
                </div>
            </div>
        );
    }
}

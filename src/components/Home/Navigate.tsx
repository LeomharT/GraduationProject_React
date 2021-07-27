import { HomeOutlined, MoneyCollectOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MenuType } from '../../interfaces/HomeInterface';
import LoginStroe from '../../redux/LoginStore';


@observer
export default class Navigate extends Component<{}, {}>
{
    loginStore: LoginStroe = new LoginStroe();
    @observable authInfo: any = {};
    @observable menuItem: MenuType[] = [
        { title: '租房', link: '/HomeList', icon: <HomeOutlined /> },
        { title: '出租', link: '/HouseRental', icon: <MoneyCollectOutlined /> },
    ];
    async componentDidMount()
    {

        this.authInfo = await this.loginStore.getAuthInfo();
        console.log(await this.authInfo);
    }
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
                    <Menu.Item
                        key={'Login'}
                        icon={<UserOutlined />}
                        onClick={() => { }}
                    >
                        <Link to="/User">
                            {
                                this.authInfo.session === null
                                    ? "登录/注册"
                                    : "okok你登录廖"
                            }
                        </Link>

                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}

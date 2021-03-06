import { ExportOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import DefaultAvatar from '../../assets/img/DefaultAvatar.png';
import '../../assets/scss/Common.scss';
import { MenuType } from '../../interfaces/HomeInterface';
import AuthStore from '../../redux/AuthStore';
import UserStore from '../../redux/UserStore';

interface HeadNavigateProps extends RouteComponentProps
{

}
@observer
class HeadNavigate extends Component<HeadNavigateProps, {}>
{
    AuthStore: AuthStore = AuthStore.GetInstance();
    UserStore: UserStore = UserStore.GetInstance();
    render()
    {
        const menuItem: MenuType[] = [
            { title: "主页", link: "/Home" },
            { title: "租房", link: "/HouseList/Exhibits" },
            { title: "心愿单", link: "/WishListFolder" },
            { title: "行程", link: "/Journey" },
            { title: "You+社区", link: "/Community" },
        ];
        const dropDownMenu = (
            <Menu style={{ width: "130px" }}>
                <Menu.Item icon={<UserOutlined />} key='PersonalCenter'>
                    <Link to="/User/EditUserInfo">个人中心</Link>
                </Menu.Item>
                <Menu.Item icon={<ProfileOutlined />} key="FeedBack">
                    反馈处理
                </Menu.Item>
                <Menu.Item
                    danger
                    icon={<ExportOutlined />}
                    key="Logout"
                    onClick={() =>
                    {
                        this.AuthStore.auth.logout().then(() =>
                        {
                            this.UserStore.InitAuthInfo();
                            this.props.history.push('/Home');
                        });
                    }}
                >退出</Menu.Item>
            </Menu>
        );
        return (
            <div className="HeadNavi">
                <div>
                    <ul>
                        {menuItem.map((menu: MenuType, index: number) =>
                        {
                            return (
                                <li key={index}>
                                    <Link to={menu.link}
                                        onClick={(e: React.MouseEvent) =>
                                        {
                                            if (menu.title === '心愿单' || menu.title === '行程')
                                            {
                                                if (!this.UserStore.CheckForIsLogin())
                                                {
                                                    e.preventDefault();
                                                }
                                            }
                                        }}
                                    >
                                        {menu.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <Dropdown overlay={dropDownMenu} trigger={['click']} placement='bottomCenter'>
                        <Avatar
                            size={30}
                            style={{ marginTop: "5px" }}
                            shape='circle'
                            src={
                                this.UserStore.authInfo.userInfo
                                    ? this.UserStore.authInfo.userInfo.photo
                                    : DefaultAvatar
                            }
                        />
                    </Dropdown>
                </div>
            </div>
        );
    }
}


export default withRouter(HeadNavigate);

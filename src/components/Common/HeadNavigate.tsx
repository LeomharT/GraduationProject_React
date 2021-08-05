import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/scss/Common.scss';
import { MenuType } from '../../interfaces/HomeInterface';
export default class HeadNavigate extends Component<{}, {}>
{
    render()
    {
        const menuItem: MenuType[] = [
            { title: "主页", link: "/Home" }
        ];
        return (
            <div className="HeadNavi">
                <ul>
                    {menuItem.map((menu: MenuType, index: number) =>
                    {
                        return (
                            <li key={index}>
                                <Link to={menu.link}>{menu.title}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

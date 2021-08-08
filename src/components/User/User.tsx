import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import '../../assets/scss/User.scss';
import AuthStore from '../../redux/AuthStore';
import UserStore from '../../redux/UserStore';
import route, { RouteType } from '../../route/router';
import HeadNavigate from '../Common/HeadNavigate';
import SideNavi from './SideNavi';

const UserWrapper = styled.div`
height: 100vh;
display: flex;
flex-direction: column;
/* justify-content: space-between; */
align-items: center;
background: #f8f9ff;
`;


@observer
export default class User extends Component<{}, {}>
{
    AuthStore: AuthStore = AuthStore.GetInstance();
    UserStore = UserStore.GetInstance();
    async componentDidMount()
    {
        if (this.UserStore.authInfo.session === null)
        {
            this.AuthStore.auth.login();
            return;
        }
        await this.UserStore.InitAuthClien();
    }
    render()
    {
        return (
            <UserWrapper>
                <HeadNavigate />
                <div className='User'>
                    <SideNavi />
                    <div className='User_MainContent'>
                        <Switch>
                            {route[2].childRoute?.map((route: RouteType, index: number) =>
                            {
                                return (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        component={route.components}
                                    />
                                );
                            })}
                        </Switch>
                    </div>
                </div>
            </UserWrapper>
        );
    }
}

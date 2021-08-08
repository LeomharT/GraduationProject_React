import { Button, Input, message } from 'antd';
import { action } from 'mobx';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import AuthStore from '../../redux/AuthStore';
import UserStore from '../../redux/UserStore';

interface U_EditUserInfoProps extends RouteComponentProps
{

}
class U_EditUserInfo extends Component<U_EditUserInfoProps, {}>
{
    AuthStore: AuthStore = AuthStore.GetInstance();
    UserStore: UserStore = UserStore.GetInstance();

    @action
    UpdateUserProfile = async () =>
    {
        try
        {
            let input = document.getElementById("userName") as HTMLInputElement;
            this.UserStore.authenticationClient.updateProfile({
                username: input.value
            })
                .then(async (userInfo) =>
                {
                    this.UserStore.authInfo.userInfo = userInfo;
                    message.success("修改成功了");
                });
        }
        catch (e)
        {
            console.log(e);
        }
    };
    LogOutAuthing = () =>
    {
        this.AuthStore.auth.logout().then(() =>
        {
            this.UserStore.InitAuthInfo();
            this.props.history.push('/Home');
        });
    };
    componentDidMount()
    {
    }
    render()
    {
        return (
            <div>
                <Input autoComplete='off' id='userName' placeholder='用户名' />
                <Button
                    onClick={() =>
                    {
                        this.UpdateUserProfile();
                    }}
                >
                    确认
                </Button>
                <Button
                    danger
                    onClick={() =>
                    {
                        this.LogOutAuthing();
                    }}
                >
                    Logout
                </Button>
            </div >
        );
    }
}


export default withRouter(U_EditUserInfo);

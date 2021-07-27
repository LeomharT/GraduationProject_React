import { message } from 'antd';
import { AuthenticationClient } from 'authing-js-sdk';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import LoginStroe from '../../redux/LoginStore';



@observer
export default class User extends Component<{}, {}>
{
    loginStore: LoginStroe = new LoginStroe();
    authInfo: any = {};
    @observable authenticationClient!: AuthenticationClient;
    initAuth = async () =>
    {
        this.authInfo = await this.loginStore.getAuthInfo();
        if (this.authInfo.session === null)
        {
            this.loginStore.auth.login();
        }
        else
        {
            this.authenticationClient = new AuthenticationClient({
                appId: '5fc0a9285330540d530ceb86',
                appHost: "https://house-domain.authing.cn",
                token: this.authInfo.userInfo.token
            });
            this.authenticationClient.getCurrentUser().then((user) =>
            {
                console.log(user);
            });
        }
    };
    logout = () =>
    {
        this.loginStore.auth.logout().then(() =>
        {
            window.location.reload();
        });
    };
    async updateUserProfile()
    {
        try
        {
            let input = document.getElementById("userName") as HTMLInputElement;
            this.authenticationClient.updateProfile({
                username: input.value
            })
                .then(() =>
                {
                    message.success("修改成功了");
                });
        }
        catch (e)
        {
            console.log(e);
        }

    }
    async componentDidMount()
    {
        this.initAuth();
    }
    render()
    {
        return (
            <div>
                <input type="text" id='userName' />
                <button onClick={() => { this.updateUserProfile(); }}>
                    update
                </button>
                <button onClick={() => { this.logout(); }}>
                    logout
                </button>
            </div>
        );
    }
}

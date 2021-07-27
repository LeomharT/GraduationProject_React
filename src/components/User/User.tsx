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

    async updateUserProfile()
    {
        await this.authenticationClient.updateProfile({
            username: "leomha2rt"
        });
    }
    async componentDidMount()
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
            console.log(this.authInfo);
        }

    }
    render()
    {
        return (
            <div>
                <button onClick={() => { this.updateUserProfile(); }}>
                    update
                </button>
                <button onClick={() => { this.loginStore.auth.logout(); }}>
                    logout
                </button>
            </div>
        );
    }
}

import { AuthenticationClient } from "authing-js-sdk";
import { observable } from "mobx";
import { io } from "socket.io-client";
import AuthStore from "./AuthStore";

export default class UserStore
{
    constructor()
    {
        this.InitAuthInfo();
    }
    AuthStore: AuthStore = AuthStore.GetInstance();
    @observable authInfo: any = {};
    authenticationClient!: AuthenticationClient;
    socketIo = io("ws://localhost:3066"); //创建socket.io实例
    InitAuthInfo = async () =>
    {
        this.authInfo = await this.AuthStore.GetAuthInfo();
    };
    InitAuthClien = async () =>
    {
        if (this.authInfo.session === null) return;
        this.authenticationClient = await this.AuthStore.InitAuthenticationClient();
        if (this.authenticationClient)
            this.authenticationClient.getCurrentUser();  //需要获取当前用户才能修改信息,合理
    };
    RenderUserName = (): String =>
    {
        let authInfo = this.authInfo;
        if (authInfo.session === null)
        { return "注册/登录"; }
        else
        {
            if (!authInfo.userInfo) return "注册/登录";
            if (authInfo.userInfo.username)
            { return authInfo.userInfo.username; }
            else
            {
                if (authInfo.userInfo.email) return authInfo.userInfo.email;
                if (authInfo.userInfo.phone) return authInfo.userInfo.phone;
            }
        }
        return '';
    };
    CheckForIsLogin = (): boolean =>
    {
        const { AuthStore } = this;
        if (this.authInfo.session == null)
        {
            AuthStore.auth.login();
            return false;
        }
        return true;
    };
    private static _SingleInstance: UserStore;
    static GetInstance()
    {
        if (this._SingleInstance) return this._SingleInstance;
        this._SingleInstance = new UserStore();
        return this._SingleInstance;
    };
}

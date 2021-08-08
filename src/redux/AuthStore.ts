import { AuthenticationClient } from "authing-js-sdk";
import { observable } from "mobx";
import { auth } from "../sso/Authing";
export default class LoginStroe
{
    @observable auth = auth; //SSO单点登录的API
    GetAuthInfo = async () =>
    {
        return await this.auth.trackSession();
    };
    InitAuthenticationClient = async (): Promise<AuthenticationClient> =>
    {
        let authInfo = await this.GetAuthInfo();
        //@ts-ignore
        if (authInfo.session === null) return;
        let authenticationClient = new AuthenticationClient({
            appId: '5fc0a9285330540d530ceb86',
            appHost: "https://house-domain.authing.cn",
            token: authInfo.userInfo.token
        });
        return authenticationClient;
    };
    private static _SingleInstance: LoginStroe;
    static GetInstance()
    {
        if (this._SingleInstance) return this._SingleInstance;
        this._SingleInstance = new LoginStroe();
        return this._SingleInstance;
    }

}

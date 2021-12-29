import { AuthenticationClient } from "authing-js-sdk";
import { auth } from "../sso/Authing";
export default class AuthStore
{
    auth = auth; //SSO单点登录的API
    GetAuthInfo = async () => await this.auth.trackSession();

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
    private static _SingleInstance: AuthStore;
    static GetInstance()
    {
        if (this._SingleInstance) return this._SingleInstance;
        this._SingleInstance = new AuthStore();
        return this._SingleInstance;
    }

}

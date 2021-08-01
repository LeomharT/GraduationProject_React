import { action, observable } from "mobx";
import { auth } from "../sso/Authing";
export default class LoginStroe
{
    constructor()
    {
        this.getAuthInfo();
    }
    @observable auth = auth; //SSO单点登录的API
    @action
    getAuthInfo = async () =>
    {
        return await this.auth.trackSession();
    };
    private static _SingleInstance: LoginStroe;
    static GetInstance()
    {
        if (this._SingleInstance) return this._SingleInstance;
        this._SingleInstance = new LoginStroe();
        return this._SingleInstance;
    }

}

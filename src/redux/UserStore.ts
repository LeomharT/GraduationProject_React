import { AuthenticationClient } from "authing-js-sdk";
import { observable } from "mobx";
import moment, { Moment } from "moment";
import { RangeValue } from 'rc-picker/lib/interface';
import { io } from "socket.io-client";
import { CONST_HOST } from "../components/Common/VariableGlobal";
import { RenewalOrderRecord, UserRentListItem } from "../interfaces/UserInferface";
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
    @observable showChat: boolean = false;
    @observable renewalRecordList: RenewalOrderRecord[] = [];
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
    GetCurrentUserId = (): string =>
    {
        return (this.authInfo?.userInfo?.id);
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
    InitCurrentUserRentList = async (uId: string): Promise<UserRentListItem[]> =>
    {
        return await (
            await fetch(`${CONST_HOST}/GetCurrentUserHouseRentList?uId=${uId}`)
        ).json();
    };
    InitRenewalOrderList = async (id: string, dataRange?: RangeValue<Moment>) =>
    {
        let URL: string = `${CONST_HOST}/GetUserRenewalOrderList?id=${id}`;
        if (dataRange)
        {
            let checkInDate = moment(dataRange[0]).format("YYYY-MM-DD");
            let checkOutDate = moment(dataRange[1]).format("YYYY-MM-DD");
            URL = `${CONST_HOST}/GetUserRenewalOrderList?id=${id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;
        } else
        {
            URL = `${CONST_HOST}/GetUserRenewalOrderList?id=${id}`;
        }
        let res = await (
            await fetch(URL)
        ).json() as RenewalOrderRecord[];
        return res;
    };
    private static _SingleInstance: UserStore;
    static GetInstance()
    {
        if (this._SingleInstance) return this._SingleInstance;
        this._SingleInstance = new UserStore();
        return this._SingleInstance;
    };
}

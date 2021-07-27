import { message } from "antd";
import { AuthenticationClient } from "authing-js-sdk";
import { observable } from "mobx";
import LoginStroe from "./LoginStore";

export default class UserStore
{
    loginStore: LoginStroe = new LoginStroe();
    authInfo: any = {};
    @observable authenticationClient!: AuthenticationClient;
    InitAuth = async () =>
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
            this.authenticationClient.getCurrentUser();  //需要获取当前用户才能修改信息,合理
        }
    };
    Logout = () =>
    {
        this.loginStore.auth.logout().then(() =>
        {
            window.location.reload();
        });
    };
    async UpdateUserProfile()
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
}

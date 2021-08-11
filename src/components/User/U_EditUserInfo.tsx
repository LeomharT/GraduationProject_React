import { FormOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Skeleton } from 'antd';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import AuthStore from '../../redux/AuthStore';
import UserStore from '../../redux/UserStore';

interface U_EditUserInfoProps extends RouteComponentProps
{

}
@observer
class U_EditUserInfo extends Component<U_EditUserInfoProps, {}>
{
    AuthStore: AuthStore = AuthStore.GetInstance();
    UserStore: UserStore = UserStore.GetInstance();
    @observable isEdit: boolean = false;
    @observable submiting: boolean = false;

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
    render()
    {
        const userInfo = this.UserStore.authInfo.userInfo;
        if (!userInfo) return (<Skeleton active />);
        return (
            <div className='U_EditUserInfo'>
                {/* 操作是否编辑、保存按钮 */}
                <div className='UserInfoOption'>
                    {!this.isEdit &&
                        <Button
                            type='link'
                            icon={<FormOutlined />}
                            onClick={action(() =>
                            {
                                this.isEdit = true;
                            })}
                        >编辑</Button>
                    }
                    {this.isEdit &&
                        <Button type='link'
                            icon={<SaveOutlined />}
                            loading={this.submiting}
                            onClick={action(() =>
                            {

                            })}
                        >保存</Button>
                    }
                    {this.isEdit &&
                        <Button type='link'
                            onClick={action(() => { this.isEdit = false; })}>
                            取消</Button>
                    }
                </div>
                {/* 表单 */}
                <Form
                    layout='inline'
                >
                    <Form.Item label="姓名">
                        {this.isEdit && <Input placeholder="input placeholder" />}
                        {!this.isEdit && <label>{userInfo.name ? userInfo.name : "-"}</label>}
                    </Form.Item>
                    <Form.Item label="用户名">
                        {this.isEdit && <Input placeholder="input placeholder" />}
                        {!this.isEdit && <label>{userInfo.username}</label>}
                    </Form.Item>
                    <Form.Item label="性别">
                        {this.isEdit && <Input placeholder="input placeholder" />}
                        {!this.isEdit && <label>{userInfo.gender ? userInfo.gender : "-"}</label>}
                    </Form.Item>
                    <Form.Item label="性别">
                        {this.isEdit && <Input placeholder="input placeholder" />}
                        {!this.isEdit && <label>{userInfo.gender ? userInfo.gender : "-"}</label>}
                    </Form.Item>
                </Form>
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

import { FormOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, message, Select, Skeleton } from 'antd';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import AuthStore from '../../redux/AuthStore';
import UserStore from '../../redux/UserStore';

const { Option } = Select;
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
                        {this.isEdit && <Input placeholder={userInfo.name} />}
                        {!this.isEdit && <label>{userInfo.name ?? "-"}</label>}
                    </Form.Item>
                    <Form.Item label="用户名">
                        {this.isEdit && <Input placeholder={userInfo.username} />}
                        {!this.isEdit && <label>{userInfo.username ?? "-"}</label>}
                    </Form.Item>
                    <Form.Item label="性别">
                        {this.isEdit &&
                            <Select defaultValue={userInfo.gender} style={{ width: "250px" }}>
                                <Option value='男'>男</Option>
                                <Option value='女'>女</Option>
                                <Option value='未分类'>未分类</Option>
                            </Select>
                        }
                        {!this.isEdit && <label>{userInfo.gender ?? "-"}</label>}
                    </Form.Item>
                    <Form.Item label="生日">
                        {this.isEdit && <DatePicker style={{ width: '250px' }} onChange={(data, dataStr) => { console.log(data, dataStr); }} />}
                        {!this.isEdit && <label>{userInfo.birthdate ?? "-"}</label>}
                    </Form.Item>
                    <Form.Item label="个人信息">
                        {this.isEdit && <Input placeholder={userInfo.profile} />}
                        {!this.isEdit && <label>{userInfo.profile ?? '-'}</label>}
                    </Form.Item>
                    <Form.Item label="个人博客">
                        {this.isEdit && <Input placeholder={userInfo.website} />}
                        {!this.isEdit && <label>{userInfo.website ?? "-"}</label>}
                    </Form.Item>
                    <Form.Item label="国家">
                        {this.isEdit &&
                            <Select defaultValue={userInfo.country} style={{ width: "250px" }}>

                            </Select>
                        }
                        {!this.isEdit && <label>{userInfo.country ?? "-"}</label>}
                    </Form.Item>
                    <Form.Item label="省/区">
                        {this.isEdit &&
                            <Select defaultValue={userInfo.province} style={{ width: "250px" }}>

                            </Select>
                        }
                        {!this.isEdit && <label>{userInfo.province ?? "-"}</label>}
                    </Form.Item>
                    <Form.Item label="城市">
                        {this.isEdit &&
                            <Select defaultValue={userInfo.city} style={{ width: "250px" }}>

                            </Select>
                        }
                        {!this.isEdit && <label>{userInfo.city ?? "-"}</label>}
                    </Form.Item>
                    <Form.Item label="注册日期">
                        <label>{moment(userInfo.signedUp).format("YYYY-MM-DD") ?? "-"}</label>
                    </Form.Item>
                </Form>
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

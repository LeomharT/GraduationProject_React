import { FormOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, FormInstance, Input, message, Select, Skeleton } from 'antd';
import { UpdateUserInput } from 'authing-js-sdk';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { RegionType } from '../../interfaces/UserInferface';
import UserStore from '../../redux/UserStore';

const { Option } = Select;
interface U_EditUserInfoProps extends RouteComponentProps
{

}
@observer
class U_EditUserInfo extends Component<U_EditUserInfoProps, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable isEdit: boolean = false;
    @observable submiting: boolean = false;
    formRef = React.createRef<FormInstance>();
    @observable provinces: RegionType[] = [];
    @observable citys: RegionType[] = [];

    @action
    UpdateUserProfile = (value: any) =>
    {
        const updates: UpdateUserInput = {};
        Object.keys(value).forEach(key =>
        {
            if (!value[key]) return;
            updates[key] = value[key];
        });
        this.submiting = true;
        this.UserStore.authenticationClient.updateProfile(updates)
            .then(newUserInfo =>
            {
                this.UserStore.authInfo.userInfo = newUserInfo;
                message.success("用户信息更新成功");
            })
            .catch(e =>
            {
                console.log(e);
                message.error("用户信息更新失败");
            })
            .finally(() =>
            {
                this.formRef.current!.resetFields();
                this.submiting = false;
                this.isEdit = false;
            });
    };
    async componentDidMount()
    {
        this.provinces = await (await fetch('http://localhost:3065/getProvince')).json();
        if (this.UserStore.authInfo.userInfo?.province)
        {
            this.citys = await (await fetch(`http://localhost:3065/initCity?T_region_NAME=${this.UserStore.authInfo.userInfo.province}`)).json();
        }
    }
    render()
    {
        const userInfo = this.UserStore.authInfo.userInfo;
        if (!userInfo) return (<Skeleton active />);
        return (
            <div className='U_EditUserInfo'>
                {/* 表单 */}
                <Form
                    ref={this.formRef}
                    layout='inline'
                    onFinish={this.UpdateUserProfile}
                >
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
                                htmlType='submit'
                            >保存</Button>
                        }
                        {this.isEdit &&
                            <Button type='link'
                                onClick={action(() =>
                                {
                                    this.formRef.current!.resetFields();
                                    this.isEdit = false;
                                })}
                            >取消</Button>
                        }
                    </div>
                    <Form.Item label="姓名" name="name">
                        <Form.Item>
                            {this.isEdit && <Input placeholder={userInfo.name} />}
                            {!this.isEdit && <label>{userInfo.name ?? "-"}</label>}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="用户名" name='username'>
                        <Form.Item>
                            {this.isEdit && <Input placeholder={userInfo.username} />}
                            {!this.isEdit && <label>{userInfo.username ?? "-"}</label>}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="性别" name='gender'>
                        <Form.Item>
                            {this.isEdit
                                && <Select
                                    defaultValue={userInfo.gender}
                                    style={{ width: "250px" }}
                                    onChange={(gender: string) =>
                                    {
                                        this.formRef.current!.setFieldsValue({
                                            gender: gender
                                        });
                                    }}
                                >
                                    <Option value='男'>男</Option>
                                    <Option value='女'>女</Option>
                                    <Option value='未分类'>未分类</Option>
                                </Select>
                            }
                            {!this.isEdit && <label>{userInfo.gender ?? "-"}</label>}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="生日" name="birthdate">
                        <Form.Item>
                            {this.isEdit
                                && <DatePicker
                                    defaultValue={
                                        userInfo.birthdate
                                            ? moment(userInfo.birthdate)
                                            : moment(new Date(Date.now()))
                                    }
                                    style={{ width: '250px' }}
                                    onChange={(data, dataStr) =>
                                    {
                                        this.formRef.current!.setFieldsValue({
                                            birthdate: dataStr
                                        });
                                    }}
                                />}
                            {!this.isEdit && <label>{userInfo.birthdate ?? "-"}</label>}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="个人信息" name="profile">
                        <Form.Item>
                            {this.isEdit && <Input placeholder={userInfo.profile} />}
                            {!this.isEdit && <label>{userInfo.profile ?? '-'}</label>}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="个人博客" name="website">
                        <Form.Item>
                            {this.isEdit && <Input placeholder={userInfo.website} />}
                            {!this.isEdit && <label>{userInfo.website ?? "-"}</label>}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="国家" name='country'>
                        <Form.Item>
                            {this.isEdit &&
                                <Input placeholder={userInfo.country} />
                            }
                            {!this.isEdit && <label>{userInfo.country ?? "-"}</label>}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="省/区" name='province'>
                        <Form.Item>
                            {this.isEdit &&
                                <Select
                                    defaultValue={userInfo.province}
                                    style={{ width: "250px" }}
                                    onChange={async (value: any) =>
                                    {
                                        let valueObj = JSON.parse(value);
                                        this.formRef.current!.setFieldsValue({
                                            province: valueObj.T_region_NAME
                                        });
                                        this.citys = await (await fetch(`http://localhost:3065/getProvince?PARENT_ID=${valueObj.T_region_ID}`)).json();
                                    }}
                                >
                                    {this.provinces.map((value: RegionType, index: number) =>
                                    {
                                        return (
                                            <Option
                                                key={index}
                                                value={
                                                    JSON.stringify({ T_region_ID: value.T_region_ID, T_region_NAME: value.T_region_NAME })
                                                }>
                                                {value.T_region_NAME}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            }
                            {!this.isEdit && <label>{userInfo.province ?? "-"}</label>}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="城市" name='city'>
                        <Form.Item>
                            {this.isEdit &&
                                <Select
                                    defaultValue={userInfo.city}
                                    style={{ width: "250px" }}
                                    onChange={(value: string) =>
                                    {
                                        this.formRef.current!.setFieldsValue({
                                            city: value
                                        });
                                    }}
                                >
                                    {this.citys.map((city: RegionType, index: number) =>
                                    {
                                        return (
                                            <Option key={index} value={city.T_region_NAME}>{city.T_region_NAME}</Option>
                                        );
                                    })}
                                </Select>
                            }
                            {!this.isEdit && <label>{userInfo.city ?? "-"}</label>}
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label="注册日期">
                        <label>{moment(userInfo.signedUp).format("YYYY-MM-DD") ?? "-"}</label>
                    </Form.Item>
                </Form>
            </div >
        );
    }
}


export default withRouter(U_EditUserInfo);

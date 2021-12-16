import { Button, Form, Input, message, Select } from 'antd';
import React, { Component } from 'react';
import { TenantInfo } from '../../../interfaces/UserInferface';
import { CONST_HOST } from '../../Common/VariableGlobal';
import Order from './Order';


declare interface AddTenantInfoProps
{
    order: Order;
    CloseDrawer: Function;
}
interface BaiduToken
{
    access_token: string;
    expires_in: number,
    refresh_token: string,
    scope: string,
    session_key: string,
    session_secret: string,
}
const { Item } = Form;
export default class AddTenantInfo extends Component<AddTenantInfoProps, {}>
{
    ConfirmTenantInfo = (tInfo: TenantInfo) =>
    {
        const reg: RegExp = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (reg.test(tInfo.tenant_num))
        {
            this.props.order.tenantInfo = tInfo;
            this.props.CloseDrawer();
        } else
        {
            message.error('请输入正确的身份证号码');
        }
    };
    GetToken = async (): Promise<BaiduToken> => await (await fetch(`${CONST_HOST}/FetchBaiduToken`)).json();
    GetBaiDuIDAnalysisResult = async (): Promise<void> =>
    {
        const token = await this.GetToken();
        const res = await (
            await fetch(`https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=${token.access_token}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'url=https://baidu-ai.bj.bcebos.com/ocr/idcard.jpeg&id_card_side=front',
            })
        ).json();
        return res;
    };
    async componentDidMount()
    {
        console.log(await this.GetBaiDuIDAnalysisResult());
    }
    render()
    {
        return (
            <div className='AddTenantInfo'>
                <Form onFinish={this.ConfirmTenantInfo} layout='vertical'>
                    <Item
                        label="姓名："
                        name="tenant_name"
                        rules={[{ required: true, message: '请输入您的姓名' }]}
                    >
                        <Input autoComplete='off' size='large' placeholder='请输入您的姓名' />
                    </Item>
                    <Item
                        label="国家地区："
                        name="contry"
                        initialValue='中国'
                    >
                        <Select size='large' >
                            <Select.Option value='中国'>
                                中国
                            </Select.Option>
                        </Select>
                    </Item>
                    <Item
                        label="身份证件类型"
                        name="id_type"
                        initialValue='居民身份证'
                    >
                        <Select size='large' >
                            <Select.Option value='居民身份证'>
                                居民身份证
                            </Select.Option>
                        </Select>
                    </Item>
                    <Item
                        label="身份证号"
                        name="tenant_num"
                        rules={[{ required: true, message: '请输入身份证号码' }]}
                    >
                        <Input autoComplete='off' size='large' placeholder='请输入身份证号码' />
                    </Item>
                    <Item>
                        <Button
                            htmlType='submit'
                            type="primary"
                            children='确定'
                        />
                    </Item>
                </Form>
            </div>
        );
    }
}

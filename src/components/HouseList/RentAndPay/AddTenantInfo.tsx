import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
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
interface BaiduIDAnalysisResult
{
    idcard_number_type: string,
    image_status: string,
    log_id: number,
    words_result:
    {
        住址: BaiduIDAnalysisResultInnerCoontent,
        公民身份号码: BaiduIDAnalysisResultInnerCoontent,
        出生: BaiduIDAnalysisResultInnerCoontent,
        姓名: BaiduIDAnalysisResultInnerCoontent,
        性别: BaiduIDAnalysisResultInnerCoontent,
        民族: BaiduIDAnalysisResultInnerCoontent,
    },
    words_result_num: number,
}
type BaiduIDAnalysisResultInnerCoontent = {
    location: {
        height: number;
        left: number;
        top: number;
        width: number;
    },
    words: string,
};
const { Item } = Form;
@observer
export default class AddTenantInfo extends Component<AddTenantInfoProps, {}>
{
    @observable loading: boolean = false;
    @observable imageUrlFront: string = '';
    @observable imageUrlBack: string = '';
    ConfirmTenantInfo = (tInfo: TenantInfo) =>
    {
        const reg: RegExp = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (reg.test(tInfo.tenant_num))
        {
            if (!this.imageUrlFront && !this.imageUrlBack)
            {

                message.error('请上传身份证照片');
                return;
            }
            this.props.order.tenantInfo = tInfo;
            this.props.CloseDrawer();
        } else
        {
            message.error('请输入正确的身份证号码');
        }

    };
    GetToken = async (): Promise<BaiduToken> => await (await fetch(`${CONST_HOST}/FetchBaiduToken`)).json();
    GetBaiDuIDAnalysisResult = async (base64: string, side: 'front' | 'back'): Promise<BaiduIDAnalysisResult> =>
    {
        const token = await this.GetToken();
        base64 = base64.split(',')[1];

        const res = await (
            await fetch(`https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=${token.access_token}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                //根据百度那边的接口转义
                body: `image=${encodeURIComponent(base64)}&id_card_side=${side}`,
            })
        ).json();
        return res;
    };
    ReadFileFromUploader = (e: UploadChangeParam<UploadFile<any>>, side: "front" | "back") =>
    {
        const { file } = e;
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file.originFileObj as File);
        fileReader.onload = async (reader) =>
        {
            message.loading({ content: "上传中", key: "ImageUploading" });
            const result = await this.GetBaiDuIDAnalysisResult(reader.target?.result as string, side);
            if (result?.image_status === "normal")
            {
                if (side === 'front')
                {
                    this.imageUrlFront = reader.target!.result as string;
                } else
                {
                    this.imageUrlBack = reader.target!.result as string;
                }
                message.success({ content: "上传成功", key: "ImageUploading" });
            } else if (result?.image_status === "reversed_side")
            {
                message.error({ content: "请检查正反面是否正确", key: "ImageUploading" });
            } else
            {
                message.error({ content: "请上传正确的身份证照片", key: "ImageUploading" });
            }
            console.log(result);
        };
    };
    render()
    {
        const { loading, imageUrlFront, imageUrlBack } = this;
        const uploadButton = (title?: string) =>
        {
            return (
                <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>{title ?? "Upload"}</div>
                </div>
            );
        };
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
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Upload
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            method='POST'
                            action={`${CONST_HOST}/FormatImageToBase64`}
                            onChange={(e) => { this.ReadFileFromUploader(e, "front"); }}
                        >
                            {imageUrlFront ? <img src={imageUrlFront} alt="IDFront" style={{ width: '100%' }} /> : uploadButton('身份证正面')}
                        </Upload>
                        <Upload
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            method='POST'
                            action={`${CONST_HOST}/FormatImageToBase64`}
                            onChange={(e) => { this.ReadFileFromUploader(e, "back"); }
                            }                        >
                            {imageUrlBack ? <img src={imageUrlBack} alt="IDBack" style={{ width: '100%' }} /> : uploadButton('身份证背面')}
                        </Upload>
                    </div>
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

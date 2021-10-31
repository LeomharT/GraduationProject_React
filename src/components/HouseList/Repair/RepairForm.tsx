import { Button, Checkbox, DatePicker, Form, FormInstance, Input } from 'antd';
import { observable } from 'mobx';
import React, { Component, createRef, RefObject } from 'react';
import { RepairOrderFormData } from '../../../interfaces/HouseListInterface';
import RepairStore from '../../../redux/RepairStore';
import UserStore from '../../../redux/UserStore';
import { RepairItem } from '../../Common/AppIconTitle';
import { LANGUAGE_REFER } from '../../Common/VariableGlobal';


const { TextArea } = Input;
export default class RepairForm extends Component
{
    UserStore: UserStore = UserStore.GetInstance();
    RepairStore: RepairStore = RepairStore.GetInstance();
    formRef: RefObject<FormInstance> = createRef<FormInstance>();
    @observable repairItemList: string[] = [];

    render()
    {
        const { UserStore, RepairStore } = this;
        return (
            <div className='RepairForm' style={{ display: RepairStore.currentStep === 1 ? 'block' : 'none' }}>
                <Form layout='horizontal'
                    ref={this.formRef}
                    onFinish={(e: RepairOrderFormData) =>
                    {
                        RepairStore.SetFormData(e);
                        RepairStore.Next();
                    }}
                >
                    <Form.Item
                        style={{ display: "none" }}
                        label='报修房屋'
                        initialValue={RepairStore.houseInfo.baseInfo.hId}
                        name='repair_hId'>
                        <Input size='large' disabled />
                    </Form.Item>
                    <Form.Item
                        style={{ display: "none" }}
                        label='报修房屋'
                        initialValue={UserStore.GetCurrentUserId()}
                        name='repair_userId'>
                        <Input size='large' disabled />
                    </Form.Item>
                    <Form.Item
                        label='报修房屋'
                        initialValue={RepairStore.houseInfo.baseInfo.hTitle}
                        name='repair_house'
                        rules={[{ required: true, message: "请输入要报修的房屋" }]}>
                        <Input size='large' disabled />
                    </Form.Item>
                    <Form.Item
                        label='报修人姓名'
                        initialValue={UserStore.RenderUserName()}
                        name='repair_name'
                        rules={[{ required: true, message: "请输入报修人姓名" }]}>
                        <Input size='large' />
                    </Form.Item>
                    <Form.Item
                        label='联系电话'
                        name='repair_phone'
                        rules={[{ required: true, message: "请输入联系电话" }]}>
                        <Input size='large' autoComplete='off' />
                    </Form.Item>
                    <Form.Item
                        label='维修时间'
                        name='repair_time'
                        rules={[{ required: true, message: "请输入您指定的维修时间" }]}>
                        <DatePicker showTime size='large' />
                    </Form.Item>
                    <Form.Item
                        label='维修项目'
                        name='repair_item'
                        rules={[{ required: true, message: "请选择需要维修的项目" }]}>
                        <Checkbox.Group className='RepairItemList'>
                            {Object.keys(LANGUAGE_REFER).map((key: string) =>
                            {
                                return (
                                    <RepairItem
                                        id={key}
                                        key={key}
                                        //@ts-ignore
                                        value={LANGUAGE_REFER[key]}
                                        //@ts-ignore
                                        type={LANGUAGE_REFER[key]}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        {
                                            if (e.target.checked)
                                            {
                                                this.repairItemList.push(e.target.value);
                                            } else
                                            {
                                                this.repairItemList.splice(this.repairItemList.indexOf(e.target.value), 1);
                                            }
                                            this.formRef.current!.setFieldsValue({
                                                repair_item: JSON.stringify(this.repairItemList)
                                            });
                                            if (!this.repairItemList.length)
                                            {
                                                this.formRef.current!.setFieldsValue({
                                                    repair_item: undefined
                                                });
                                            }
                                        }}
                                    />
                                );
                            })}
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item
                        label='故障描述'
                        name='repair_detail'
                        rules={[{ required: true, message: "亲输入您的具体描述" }]}
                    >
                        <TextArea size='large' rows={5} placeholder='简要描述故障'></TextArea>
                    </Form.Item>

                    <Button htmlType='submit' children='下一步' type='primary' />
                    <Button children='上一步' style={{ marginLeft: '10px' }}
                        onClick={this.RepairStore.Prev}
                    />
                </Form>
            </div >
        );
    }
}

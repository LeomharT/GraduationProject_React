import { DeleteOutlined, ExclamationOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { HouseBaseInfo } from '../../interfaces/HouseListInterface';
import HouseStore from '../../redux/HouseStore';
import UserStore from '../../redux/UserStore';
import { CONST_HOST } from '../Common/VariableGlobal';
import HouseItem from '../HouseList/HouseItem';

@observer
export default class U_UserCollect extends Component
{
    UserStore: UserStore = UserStore.GetInstance();
    HouseStore: HouseStore = HouseStore.GetInstance();
    @observable userCollections: HouseBaseInfo[] = [];
    InitUserCollections = async () =>
    {
        const { id } = this.UserStore.authInfo?.userInfo;
        this.userCollections = (await (await fetch(`${CONST_HOST}/GetAllUserCollections?id=${id}`)).json()) as HouseBaseInfo[];
    };
    async componentDidMount()
    {
        await this.InitUserCollections();
    }
    render()
    {
        const { userCollections, UserStore, HouseStore } = this;
        return (
            <div className='U_Collections'>
                {
                    userCollections.map((h: HouseBaseInfo) =>
                    {
                        return (
                            <div className='U_CollectWrapper' key={h.hId}>
                                <HouseItem HouseInfo={h} />
                                <Popconfirm
                                    title='确定要删除吗?'
                                    placement='bottom'
                                    okType='danger'
                                    okText='确定'
                                    cancelText='取消'
                                    icon={
                                        <ExclamationOutlined style={{ color: 'red' }} />
                                    }
                                    onConfirm={() =>
                                    {
                                        HouseStore.DeleteCurrentHouseFromUserCollections(
                                            UserStore.authInfo.userInfo.id,
                                            h.hId,
                                            this.InitUserCollections
                                        );
                                    }}
                                >
                                    <Button
                                        type='text'
                                        className='DeleteCollectBtn'
                                        danger
                                        size='large'
                                        icon={
                                            <DeleteOutlined />
                                        } />
                                </Popconfirm>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

import { LeftOutlined } from '@ant-design/icons';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import ExclamationOutlined from '@ant-design/icons/lib/icons/ExclamationOutlined';
import { Button, Empty, Popconfirm } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, createRef, RefObject } from 'react';
import '../../assets/scss/WishList.scss';
import { HouseBaseInfo } from '../../interfaces/HouseListInterface';
import HouseStore from '../../redux/HouseStore';
import UserStore from '../../redux/UserStore';
import HeadNavigate from '../Common/HeadNavigate';
import { CONST_HOST } from '../Common/VariableGlobal';
import HouseItem from '../HouseList/HouseItem';

@observer
export default class U_UserCollect extends Component
{
    UserStore: UserStore = UserStore.GetInstance();
    HouseStore: HouseStore = HouseStore.GetInstance();
    tMapRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    @observable userCollections: HouseBaseInfo[] = [];
    InitUserCollections = async () =>
    {
        const { id } = this.UserStore?.authInfo?.userInfo;
        this.userCollections = (await (await fetch(`${CONST_HOST}/GetAllUserCollections?id=${id}`)).json()) as HouseBaseInfo[];
    };
    InitMap = () =>
    {
        new TMap.Map(this.tMapRef.current, {
            center: new TMap.LatLng(26.100271, 119.295624),
            zoom: 11,
            pitch: 43.5,
            rotation: 45,
            viewMode: "2D"
        });
    };
    async componentDidMount()
    {
        if (!this.UserStore.CheckForIsLogin()) return;
        await this.InitUserCollections();
        this.InitMap();
    }
    render()
    {
        const { userCollections, UserStore, HouseStore } = this;
        return (
            <div className='U_Collections'>
                <HeadNavigate />
                {(!userCollections.length)
                    ? (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂时没有收藏任何房源' />)
                    : <div className='WishList'>
                        <div className='ListContent'>
                            <h1>
                                <Button icon={<LeftOutlined />} type='link' />
                                心愿单
                            </h1>
                            {userCollections.map((h: HouseBaseInfo) =>
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
                            })}
                        </div>
                        <div
                            ref={this.tMapRef}
                            className='MapArea' />
                    </div>
                }
            </div>
        );
    }
}

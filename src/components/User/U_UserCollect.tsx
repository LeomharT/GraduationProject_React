import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { HouseBaseInfo } from '../../interfaces/HouseListInterface';
import UserStore from '../../redux/UserStore';
import { CONST_HOST } from '../Common/VariableGlobal';
import HouseItem from '../HouseList/HouseItem';

@observer
export default class U_UserCollect extends Component
{
    UserStore: UserStore = UserStore.GetInstance();
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
        const { userCollections } = this;
        return (
            <div className='U_Collections'>
                {
                    userCollections.map((h: HouseBaseInfo) =>
                    {
                        return (
                            <HouseItem key={h.hId} HouseInfo={h} />
                        );
                    })
                }
            </div>
        );
    }
}

import { Spin } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { HouseInfo } from '../../interfaces/HouseListInterface';
import { UserRentListItem } from '../../interfaces/UserInferface';
import HouseStore from '../../redux/HouseStore';
import UserStore from '../../redux/UserStore';
import HouseItem from '../HouseList/HouseItem';

@observer
export default class U_UserRents extends Component<{}, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    HouseStore: HouseStore = HouseStore.GetInstance();
    @observable userRentList: UserRentListItem[] = [];
    @observable houseInfo: HouseInfo;
    async componentDidMount()
    {
        this.userRentList = await this.UserStore.InitCurrentUserRentList(this.UserStore.GetCurrentUserId());
        if (this.userRentList.length)
        {
            this.houseInfo = await this.HouseStore.InitHouseInfo(this.userRentList[0].hId);
            console.log(this.houseInfo);
        }
    }
    render()
    {
        const { userRentList, houseInfo } = this;
        if (!houseInfo) return (<Spin size='large' />);
        return (
            <div className='U_UserRents'>
                {userRentList.map((ur: UserRentListItem) =>
                {
                    return (
                        <HouseItem HouseInfo={houseInfo.baseInfo} />
                    );
                })}
            </div>
        );
    }
}

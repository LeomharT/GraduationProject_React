import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { UserRentListItem } from '../../interfaces/UserInferface';
import UserStore from '../../redux/UserStore';

@observer
export default class U_UserRents extends Component<{}, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable userRentList: UserRentListItem[] = [];
    async componentDidMount()
    {
        this.userRentList = await this.UserStore.InitCurrentUserRentList(this.UserStore.GetCurrentUserId());
        console.log(this.userRentList);
    }
    render()
    {
        return (
            <div className='U_UserRents'>
                我是用户住房子的列表
            </div>
        );
    }
}

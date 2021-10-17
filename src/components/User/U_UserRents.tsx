import React, { Component } from 'react';
import { UserRentListItem } from '../../interfaces/UserInferface';
import UserStore from '../../redux/UserStore';

export default class U_UserRents extends Component<{}, {}>
{
    userRentList: UserRentListItem[] = [];
    UserStore: UserStore = UserStore.GetInstance();
    async componentDidMount()
    {
        console.log(await this.UserStore.InitCurrentUserRentList(this.UserStore?.authInfo?.userInfo?.id));
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

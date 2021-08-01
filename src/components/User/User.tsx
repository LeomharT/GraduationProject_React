import { observer } from 'mobx-react';
import React, { Component } from 'react';
import styled from 'styled-components';
import '../../assets/scss/User.scss';
import UserStore from '../../redux/UserStore';
import HeadNavigate from '../Common/HeadNavigate';

const UserWrapper = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
`;


@observer
export default class User extends Component<{}, {}>
{
    UserStore = new UserStore();

    async componentDidMount()
    {
        this.UserStore.InitAuth();
    }
    render()
    {
        return (
            <UserWrapper>
                <HeadNavigate />
                <div className='User'>
                    <input type="text" id='userName' />
                    <button onClick={() => { this.UserStore.UpdateUserProfile(); }}>
                        update
                    </button>
                    <button onClick={() => { this.UserStore.Logout(); }}>
                        logout
                    </button>
                </div>
            </UserWrapper>
        );
    }
}

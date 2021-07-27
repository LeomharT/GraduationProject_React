import { observer } from 'mobx-react';
import React, { Component } from 'react';
import styled from 'styled-components';
import '../../assets/scss/User.scss';
import UserStore from '../../redux/UserStore';

const UserWrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;
width: 100vw;
height: 100vh;
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

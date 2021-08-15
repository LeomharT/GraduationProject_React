import React, { Component } from 'react';
import styled from 'styled-components';
import '../../assets/scss/HouseList.scss';
import HeadNavigate from '../Common/HeadNavigate';
import HFilter from './HFilter';
import HList from './HList';

const HouseListWrapper = styled.div`
display: flex;
flex-direction: column;
overflow-y: auto;
overflow-x: hidden;
`;
export default class HouseList extends Component<{}, {}>
{
    render()
    {
        return (
            <HouseListWrapper>
                <HeadNavigate />
                <HFilter />
                <HList />
            </HouseListWrapper>
        );
    }
}

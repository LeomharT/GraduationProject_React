import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import styled from 'styled-components';
import '../../assets/scss/HouseList.scss';
import route from '../../route/router';
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
                <Switch>
                    {route[1].childRoute?.map((routes, index) =>
                    {
                        return (
                            <Route
                                key={index}
                                path={routes.path}
                                component={routes.components}
                            />
                        );
                    })}
                </Switch>
            </HouseListWrapper>
        );
    }
}

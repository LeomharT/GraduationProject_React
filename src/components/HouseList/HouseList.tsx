import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import '../../assets/scss/HouseList.scss';
import route, { RouteType } from '../../route/router';
import HeadNavigate from '../Common/HeadNavigate';

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
                <Switch>
                    {route[1].childRoute?.map((r: RouteType, index) =>
                    {
                        return (
                            <Route key={index} path={r.path} component={r.components} />
                        );
                    })}
                </Switch>
            </HouseListWrapper>
        );
    }
}

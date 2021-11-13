import React, { Component } from 'react';
import { Switch } from 'react-router';
import '../../assets/scss/BackStage.scss';
import route, { RouteType } from '../../route/router';
export default class BackStage extends Component
{
    render()
    {
        return (
            <Switch>
                {route[route.length - 1].childRoute!.map((r: RouteType) =>
                {
                    console.log(r);
                })}
            </Switch>
        );
    }
}

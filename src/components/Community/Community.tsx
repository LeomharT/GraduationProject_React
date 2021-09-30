import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import '../../assets/scss/Community.scss';
import route, { RouteType } from '../../route/router';
import HeadNavigate from '../Common/HeadNavigate';

@observer
export default class Community extends Component<{}, {}>
{
    render()
    {
        return (
            <div className='Community'>
                <HeadNavigate />
                <Switch>
                    {route[5].childRoute!.map((r: RouteType) =>
                    {
                        return (
                            <Route
                                key={r.title}
                                path={r.path}
                                component={r.components}
                                exact
                            />
                        );
                    })}
                </Switch>
            </div>
        );
    }
}

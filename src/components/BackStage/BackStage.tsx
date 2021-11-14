import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import '../../assets/scss/BackStage.scss';
import route, { RouteType } from '../../route/router';
import Aside from './Aside';
import Headers from './Headers';
import { globalStore } from './redux/Global/Global_Store';
import { HouseListStore } from './redux/HouseMainTain/House_Store';
export default function BackStage()
{
    return (
        <Provider store={globalStore}>
            <div className='BackStage'>
                <Aside />
                <main>
                    <Headers />
                    <div className='MainContent'>
                        <Provider store={HouseListStore}>
                            <Switch>
                                {route[10].childRoute?.map((r: RouteType) =>
                                {
                                    return (
                                        <Route key={r.path} exact={true} path={r.path} component={r.components} />
                                    );
                                })}
                            </Switch>
                        </Provider>
                    </div>
                </main>
            </div>
        </Provider>
    );
}

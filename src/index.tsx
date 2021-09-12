import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HConsult from './components/HConsult/HConsult';
import './index.css';
import reportWebVitals from './reportWebVitals';
import route, { RouteType } from './route/router';



ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                {route.map((item: RouteType, index: number) =>
                {
                    return (
                        <Route
                            key={index}
                            path={item.path}
                            component={item.components}
                        />
                    );
                })}
            </Switch>
            <HConsult />
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

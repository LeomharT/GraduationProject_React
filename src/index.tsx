import 'antd/dist/antd.css';
import moment from 'moment';
import 'nprogress/nprogress.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HConsult from './components/HConsult/HConsult';
import './index.css';
import reportWebVitals from './reportWebVitals';
import route, { RouteType } from './route/router';
import toChineseNumber from './util/toChineseNumber';
//汉化时间
moment.defineLocale('zh-cn', {
    relativeTime: {
        future: '%s内',
        past: '%s前',
        s: '几秒',
        m: '1 分钟',
        mm: '%d 分钟',
        h: '1 小时',
        hh: '%d 小时',
        d: '1 天',
        dd: '%d 天',
        M: '1 个月',
        MM: '%d 个月',
        y: '1 年',
        yy: '%d 年',
    },
});

Object.defineProperty(String, 'toChineseNumber', {
    value: toChineseNumber,
    enumerable: true,
    configurable: false,
    writable: false,
});
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

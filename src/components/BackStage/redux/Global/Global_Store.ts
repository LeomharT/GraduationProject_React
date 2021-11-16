import { applyMiddleware, compose, createStore } from 'redux';
import { RootReducerGlobal } from './Global_Reducer';
import { RootSagaHouseList, sagaMiddlewareHouseList } from './Global_Saga';

//@ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

export const globalStore = createStore(
    RootReducerGlobal,
    composeEnhancers(applyMiddleware(sagaMiddlewareHouseList)),
);
sagaMiddlewareHouseList.run(RootSagaHouseList);

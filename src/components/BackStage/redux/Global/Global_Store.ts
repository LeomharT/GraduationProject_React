import { createStore } from 'redux';
import { RootReducerGlobal } from './Global_Reducer';
export const globalStore = createStore(
    RootReducerGlobal,
    //要添加一个能够在Redux-devtool里看见
    //@ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : undefined
);

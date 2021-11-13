import { createStore } from 'redux';
import { RootReducerGlobal } from './Global_Reducer';
export const globalStore = createStore(RootReducerGlobal);

import { applyMiddleware, createStore } from "redux";
import { RootReducerHouseList } from "./House_Reducer";
import { RootSagaHouseList, sagaMiddlewareHouseList } from "./House_Saga";

export const HouseListStore = createStore(
    RootReducerHouseList,
    applyMiddleware(sagaMiddlewareHouseList)
);

sagaMiddlewareHouseList.run(RootSagaHouseList);

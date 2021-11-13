import { Reducer } from "react";
import { Action, combineReducers } from 'redux';
import { IsAsideFoldedEnum } from "./Global_Type";

//侧边栏是否折叠
export const IsAsideFoldedReducer: Reducer<boolean, Action<IsAsideFoldedEnum>> =
    (state: boolean, action: Action<IsAsideFoldedEnum>): boolean =>
    {
        switch (action.type)
        {
            case IsAsideFoldedEnum.Fold:
                return true;
            case IsAsideFoldedEnum.UnFold:
                return false;
            default:
                return false;
        }
    };

export const RootReducerGlobal = combineReducers({
    IsAsideFoldedReducer,
});
export type RootStateGlobal = ReturnType<typeof RootReducerGlobal>;

import { Reducer } from "react";
import { combineReducers } from "redux";
import { HouseInfo } from "../../../../interfaces/HouseListInterface";
import { ActionProps } from "../Global/Global_Type";
import { HouseListEnum } from "./House_Type";

export const SelectHouseListReducer: Reducer<HouseInfo[], ActionProps<HouseListEnum, HouseInfo[]>> =
    (state: HouseInfo[], action: ActionProps<HouseListEnum, HouseInfo[]>): HouseInfo[] =>
    {
        if (typeof state === 'undefined') return [];
        switch (action.type)
        {
            case HouseListEnum.SELECT: {
                if (action.payload)
                {
                    state = action.payload;
                }
                return state;
            }
            default:
                return state;
        }
    };
export const RootReducerHouseList = combineReducers({
    SelectHouseListReducer
});
export type RootStateHouseList = ReturnType<typeof RootReducerHouseList>;

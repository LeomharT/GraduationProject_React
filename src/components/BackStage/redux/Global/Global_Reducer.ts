import { Reducer } from "react";
import { Action, combineReducers } from 'redux';
import { HouseInfo, RepairOrderFormData } from "../../../../interfaces/HouseListInterface";
import { ActionProps, HouseListEnum, IsAsideFoldedEnum, RepairListEnum } from "./Global_Type";

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

//获取房屋列表
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
//获取报修列表
export const SelectRepairReducer: Reducer<RepairOrderFormData[], ActionProps<RepairListEnum, RepairOrderFormData[]>> =
    (state: RepairOrderFormData[], action: ActionProps<RepairListEnum, RepairOrderFormData[]>): RepairOrderFormData[] =>
    {
        if (typeof state === 'undefined') return [];
        switch (action.type)
        {
            case RepairListEnum.SELECT: {
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
export const RootReducerGlobal = combineReducers({
    IsAsideFoldedReducer,
    SelectHouseListReducer,
    SelectRepairReducer,
});
export type RootStateGlobal = ReturnType<typeof RootReducerGlobal>;

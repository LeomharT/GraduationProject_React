import { HouseInfo, RepairOrderFormData } from "../../../../interfaces/HouseListInterface";
import { RootStateGlobal } from "./Global_Reducer";

export const IsAsideFoldedSelector = (state: RootStateGlobal) => state.IsAsideFoldedReducer;

export const SelectHouseListSelector = (state: RootStateGlobal): HouseInfo[] => state.SelectHouseListReducer;

export const SelectRepairListSelector = (state: RootStateGlobal): RepairOrderFormData[] => state.SelectRepairReducer;

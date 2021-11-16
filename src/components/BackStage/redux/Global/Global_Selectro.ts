import { HouseInfo } from "../../../../interfaces/HouseListInterface";
import { RootStateGlobal } from "./Global_Reducer";

export const IsAsideFoldedSelector = (state: RootStateGlobal) => state.IsAsideFoldedReducer;

export const SelectHouseListSelector = (state: RootStateGlobal): HouseInfo[] => state.SelectHouseListReducer;

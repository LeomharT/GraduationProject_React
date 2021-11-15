import { HouseInfo } from "../../../../interfaces/HouseListInterface";
import { RootStateHouseList } from "./House_Reducer";

export const SelectHouseListSelector = (state: RootStateHouseList): HouseInfo[] => state.SelectHouseListReducer;
export const UpdateHouseListSelector = (state: RootStateHouseList): any => state.UpdateHouseListReduece;

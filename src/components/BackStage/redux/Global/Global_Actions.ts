import { HouseInfo } from "../../../../interfaces/HouseListInterface";
import { HouseListType, IsAsideFoldedEnum, IsAsideFoldedType, RepairListType } from "./Global_Type";

export const FoldAside = (): IsAsideFoldedType => ({ type: IsAsideFoldedEnum.Fold });
export const UnFoldAside = (): IsAsideFoldedType => ({ type: IsAsideFoldedEnum.UnFold });

export const SelectHouseListAction = (payload: HouseInfo[]): HouseListType => ({ type: 'SelectHouseList', payload });

export const SelectRepairListAction = (payload: any): RepairListType => ({ type: "SelectRepairList", payload });

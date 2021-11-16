import { HouseInfo } from "../../../../interfaces/HouseListInterface";
import { HouseListType, IsAsideFoldedEnum, IsAsideFoldedType } from "./Global_Type";

export const FoldAside = (): IsAsideFoldedType => ({ type: IsAsideFoldedEnum.Fold });
export const UnFoldAside = (): IsAsideFoldedType => ({ type: IsAsideFoldedEnum.UnFold });

export const SelectHouseListAction = (payload: HouseInfo[]): HouseListType => ({ type: 'SelectHouseList', payload });

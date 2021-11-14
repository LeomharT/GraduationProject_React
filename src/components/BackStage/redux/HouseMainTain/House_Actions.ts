import { HouseInfo } from "../../../../interfaces/HouseListInterface";
import { HouseListEnum, HouseListType } from "./House_Type";
export const SelectHouseList = (payload: HouseInfo[]): HouseListType => ({ type: HouseListEnum.SELECT, payload });

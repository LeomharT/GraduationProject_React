import { HouseBaseInfo, HouseDetailInfo, HouseInfo } from "../../../../interfaces/HouseListInterface";
import { HouseListType } from "./House_Type";
export const SelectHouseListAction = (payload: HouseInfo[]): HouseListType => ({ type: 'SelectHouseList', payload });
export const UpdateHosueListAction = (payload: HouseBaseInfo & HouseDetailInfo): HouseListType => ({ type: 'UpdateHouseList', payload });

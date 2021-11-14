import { HouseInfo } from "../../../../interfaces/HouseListInterface";
import { ActionProps } from "../Global/Global_Type";

export enum HouseListEnum
{
    SELECT = 'SELECT',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    INSERT = 'INSERT'
}
export type HouseListType = ActionProps<HouseListEnum, HouseInfo[]>;

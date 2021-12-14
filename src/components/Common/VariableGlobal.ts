import { CSSProperties } from "styled-components";

export const CONST_HOST = "http://localhost:3065";
export enum LANGUAGE_REFER
{
    AirCondition = "空调",
    Bed = '床',
    Closet = "衣柜",
    Gas = "燃气",
    Heating = "暖气",
    LaundryMachine = "洗衣机",
    Refrigerator = "冰箱",
    Television = "电视",
    WaterHeater = "热水器",
    WIFI = "WIFI"

}
export interface DataRowState
{
    affectedRows: number;
    changedRows: number;
    fieldCount: number;
    insertId: number;
    message: string;
    protocol41: boolean;
    serverStatus: number;
    warningCount: number;
}
export const SpinStyle: CSSProperties = {
    position: "absolute",
    top: '40%',
    left: '50%',
    marginLeft: "-20px",
};

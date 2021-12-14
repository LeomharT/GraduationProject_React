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
export const toChinesNum = (num: string | number) =>
{
    let changeNum = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    let unit = ["", "十", "百", "千", "万"];
    num = parseInt(num as string);
    let getWan = (temp: any) =>
    {
        let strArr = temp.toString().split("").reverse();
        let newNum = "";
        for (var i = 0; i < strArr.length; i++)
        {
            newNum = (i === 0 && strArr[i] === 0 ? "" : (i > 0 && strArr[i] === 0 && strArr[i - 1] === 0 ? "" : changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i]))) + newNum;
        }
        return newNum;
    };
    let overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    //@ts-ignore
    if (noWan.toString().length < 4) noWan = "0" + noWan;
    return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);

};

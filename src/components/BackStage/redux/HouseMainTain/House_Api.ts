import { HouseInfo } from "../../../../interfaces/HouseListInterface";
import { CONST_HOST } from "../../../Common/VariableGlobal";

export const SelectHouseListApi = async (): Promise<HouseInfo[] | undefined> =>
{
    return (
        await (await fetch(`${CONST_HOST}/SelectHouseDetailList`)).json()
    );
};
export const UpdateHouseListApi = async (payload: any): Promise<any | undefined> =>
{
    console.log(payload);
};

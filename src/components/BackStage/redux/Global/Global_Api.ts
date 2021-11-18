import { HouseInfo, RepairOrderFormData } from "../../../../interfaces/HouseListInterface";
import { CONST_HOST } from "../../../Common/VariableGlobal";

export const SelectHouseListApi = async (): Promise<HouseInfo[] | undefined> =>
{
    return (
        await (await fetch(`${CONST_HOST}/SelectHouseDetailList`)).json()
    );
};

export const SelectRepairListApi = async (): Promise<RepairOrderFormData | undefined> =>
{
    return (
        await (
            await fetch(`${CONST_HOST}/GetRepairOrders`, {
                method: "POST",
            })
        ).json()
    );
};

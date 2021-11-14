import { CONST_HOST } from "../../../Common/VariableGlobal";

export const SelectHouseListApi = async (): Promise<any | undefined> =>
{
    return (
        await (await fetch(`${CONST_HOST}/SelectHouseDetailList`)).json()
    );
};

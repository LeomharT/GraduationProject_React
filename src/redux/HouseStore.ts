import { message } from "antd";
import { observable } from "mobx";
import { CONST_HOST } from "../components/Common/VariableGlobal";
import { HouseExhibitList } from "../interfaces/HouseListInterface";

export default class HouseStore
{
    @observable HouseExhibitList: HouseExhibitList;
    DeleteCurrentHouseFromUserCollections = async (id: string | number, hId: number | string, callback: Function) =>
    {
        let res = await fetch(`${CONST_HOST}/DeleteHouseFromCollections?id=${id}&hId=${hId}`);
        let result = await res.json();
        if (result.affectedRows as boolean)
        {
            message.success("删除收藏成功");
        }
        else
        {
            message.error("删除收藏失败");
        }
        callback();
    };
    private static _SingleInstance: HouseStore;
    static GetInstance(): HouseStore
    {
        if (this._SingleInstance) return this._SingleInstance;
        this._SingleInstance = new HouseStore();
        return this._SingleInstance;
    }
}

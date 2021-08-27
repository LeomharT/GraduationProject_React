import { observable } from "mobx";
import { HouseBaseInfo } from "../interfaces/HouseListInterface";

export default class HouseStore
{
    @observable HouseList: HouseBaseInfo[] = [];
    private static _SingleInstance: HouseStore;
    static GetInstance(): HouseStore
    {
        if (this._SingleInstance) return this._SingleInstance;
        this._SingleInstance = new HouseStore();
        return this._SingleInstance;
    }
}

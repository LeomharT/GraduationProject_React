import { observable } from "mobx";
import { HouseInfo } from "../interfaces/HouseListInterface";

export default class RepairStore
{
    @observable houseInfo: HouseInfo;
    @observable currentStep: number = 0;

    Next = () => this.currentStep++;
    Prev = () => this.currentStep--;
    private static _SingleInstance: RepairStore;
    static GetInstance()
    {
        if (this._SingleInstance) return this._SingleInstance;
        this._SingleInstance = new RepairStore();
        return this._SingleInstance;
    }
}

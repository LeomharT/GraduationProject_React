import { observable } from "mobx";
import { HouseInfo, RepairOrderFormData } from "../interfaces/HouseListInterface";

export default class RepairStore
{
    @observable houseInfo: HouseInfo;
    @observable currentStep: number = 0;
    repairFormData: RepairOrderFormData;

    Next = () => this.currentStep++;
    Prev = () => this.currentStep--;
    SetFormData = (value: RepairOrderFormData) => this.repairFormData = value;
    private static _SingleInstance: RepairStore;
    static GetInstance()
    {
        if (this._SingleInstance) return this._SingleInstance;
        this._SingleInstance = new RepairStore();
        return this._SingleInstance;
    }
}

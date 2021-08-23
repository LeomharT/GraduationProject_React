
export default class HouseStore
{
    private static _SingleInstance: HouseStore;
    static GetInstance(): HouseStore
    {
        if (this._SingleInstance) return this._SingleInstance;
        this._SingleInstance = new HouseStore();
        return this._SingleInstance;
    }
}

import { message } from "antd";
import { observable } from "mobx";
import NProgress from "nprogress";
import { CONST_HOST } from "../components/Common/VariableGlobal";
import { HouseExhibitList, HouseParams } from "../interfaces/HouseListInterface";

export default class HouseStore
{
    @observable HouseExhibitList: HouseExhibitList;           //房屋列表和总条目
    @observable HouseFilterParams: FormData = new FormData(); //筛选对象
    @observable HouseParams: HouseParams[] = [];              //筛选的参数
    @observable HouseListCurrentPage: number = 1;             //当前页码

    /**
     * @description            初始化房屋列表
     * @param {FormData}filter 筛选参数
     */
    InitHouseList = async (filter: FormData, page: string = '1') =>
    {
        NProgress.start();
        let res = await fetch(`${CONST_HOST}/GetHouseExhibitList?page=${page}`, {
            method: "POST",
            body: filter
        });
        this.HouseExhibitList = await res.json() as HouseExhibitList;
        NProgress.done();
    };
    /**
     * @param id       用户唯一标识
     * @param hId      房屋唯一标识
     * @param callback 删除之后执行刷新收藏列表
     * @description    删除用户的房屋收藏条目
     */
    DeleteCurrentHouseFromUserCollections =
        async (id: string | number, hId: number | string, callback: Function) =>
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

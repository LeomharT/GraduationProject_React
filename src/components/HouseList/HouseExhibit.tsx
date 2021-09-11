import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { HouseBaseInfo, HouseExhibitList } from '../../interfaces/HouseListInterface';
import HouseStore from '../../redux/HouseStore';
import { CONST_HOST } from '../Common/VariableGlobal';
import HFilter from './HFilter';
import HouseItem from './HouseItem';


@observer
export default class HouseExhibit extends Component<{}, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    InitHouseList = async (): Promise<HouseExhibitList> =>
    {
        let res = await fetch(`${CONST_HOST}/GetHouseExhibitList`, { method: "POST" });
        return await res.json() as HouseExhibitList;
    };
    async componentDidMount()
    {
        this.HouseStore.HouseExhibitList = await this.InitHouseList() as HouseExhibitList;
    }
    render()
    {
        const { HouseExhibitList } = this.HouseStore;
        return (
            <div className="HouseList">
                <HFilter />
                {HouseExhibitList?.HouseList.map((house: HouseBaseInfo) =>
                {
                    return (
                        <HouseItem key={house.hId} HouseInfo={house} />
                    );
                })}
            </div>
        );
    }
}

import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { HouseBaseInfo } from '../../interfaces/HouseListInterface';
import HouseStore from '../../redux/HouseStore';
import HFilter from './HFilter';
import HouseItem from './HouseItem';


@observer
export default class HouseExhibit extends Component<{}, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    InitHouseList = async (): Promise<HouseBaseInfo[]> =>
    {
        let res = await fetch("http://localhost:3065/GetHouseExhibitList", { method: "POST" });
        return await res.json();
    };
    async componentDidMount()
    {
        this.HouseStore.HouseList = await this.InitHouseList();
    }
    render()
    {
        const { HouseList } = this.HouseStore;
        return (
            <div className="HouseList">
                <HFilter />
                {HouseList.map((house: HouseBaseInfo) =>
                {
                    return (
                        <HouseItem key={house.hId} HouseInfo={house} />
                    );
                })}

            </div>
        );
    }
}

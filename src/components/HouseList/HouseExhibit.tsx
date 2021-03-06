import { Empty, Pagination } from 'antd';
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
    async componentDidMount()
    {
        this.HouseStore.HouseFilterParams = new FormData();
        this.HouseStore.HouseListCurrentPage = 1;
        await this.HouseStore.InitHouseList(this.HouseStore.HouseFilterParams);
    }
    render()
    {
        const { HouseExhibitList } = this.HouseStore;
        return (
            <div className="HouseList">
                <HFilter />
                {HouseExhibitList?.HouseList.length === 0
                    ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无数据' />
                    : HouseExhibitList?.HouseList.map((house: HouseBaseInfo) =>
                    {
                        return (
                            <HouseItem key={house.hId} HouseInfo={house} />
                        );
                    })
                }
                <Pagination
                    showSizeChanger={false}
                    current={this.HouseStore.HouseListCurrentPage}
                    total={
                        Math.ceil((HouseExhibitList?.count ?? 2) / 2) * 10
                    }
                    onChange={async (page) =>
                    {
                        this.HouseStore.HouseListCurrentPage = page;
                        await this.HouseStore.InitHouseList(this.HouseStore.HouseFilterParams, page.toString());
                    }}
                />
            </div>
        );
    }
}

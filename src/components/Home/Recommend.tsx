import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import RecommendImg from '../../assets/img/Recommend.png';
import { HouseBaseInfo } from '../../interfaces/HouseListInterface';
import HouseStore from '../../redux/HouseStore';
import HouseItem from '../HouseList/HouseItem';
@observer
export default class Recommend extends Component<{}, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    @observable recommentList: HouseBaseInfo[] = [];
    async componentDidMount()
    {
        this.recommentList = this.recommentList.concat(
            (await this.HouseStore.InitHouseList(new FormData(), "2")).HouseList
        ).concat(
            (await this.HouseStore.InitHouseList(new FormData(), "1")).HouseList
        );
    }
    render()
    {
        const { recommentList } = this;
        return (
            <div className='HomeRecommend'>
                <div className="RecommendTitle">
                    <p>精品好房</p>
                    <span>好房源那么多,我们为您精选</span>
                </div>
                <div className='RecommendContent'>
                    <div className="Content_Img">
                        <img alt="推荐图片" src={RecommendImg} />
                    </div>
                    <div className='Content_Items'>
                        {
                            recommentList.map((h: HouseBaseInfo) =>
                            {
                                return (
                                    <HouseItem key={h.hId} HouseInfo={h} />
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

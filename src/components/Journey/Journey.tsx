import { RightOutlined } from '@ant-design/icons';
import { Button, Divider, Tabs } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import JourneyWhenEmptyPng from '../../assets/img/JourneyWhenEmpty.png';
import '../../assets/scss/Journey.scss';
import { HouseInfo } from '../../interfaces/HouseListInterface';
import { UserRentListItem } from '../../interfaces/UserInferface';
import HouseStore from '../../redux/HouseStore';
import UserStore from '../../redux/UserStore';
import HeadNavigate from '../Common/HeadNavigate';
import { CONST_HOST } from '../Common/VariableGlobal';
@observer
export default class Journey extends Component
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable userJourneyList: UserRentListItem[] = [];
    async componentDidMount()
    {
        this.userJourneyList = await this.UserStore.InitCurrentUserRentList(this.UserStore.GetCurrentUserId(), true);
    }
    render()
    {
        return (
            <div className='Journey'>
                <div className='JourneyContentWrapper'>
                    <HeadNavigate />
                    <div className='JourneyContent'>
                        <h1>行程</h1>
                        <Tabs size='large' defaultActiveKey='2'>
                            <Tabs.TabPane tab='即将开始的行程' key='1'>
                                <CommingJourney />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab='过往行程' key='2'>
                                <PastJourney userJourneyList={this.userJourneyList} />
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}
class CommingJourney extends Component<{}, {}>
{
    render()
    {

        return (
            <div className='CommingJourney'>
                <JourneyWhenEmpty info='当您准备好开始规划下一次行程时，我们会随时为您提供帮助。' />
            </div>
        );

    }
}
class PastJourney extends Component<{ userJourneyList: UserRentListItem[]; }, {}>
{
    render()
    {
        if (!this.props.userJourneyList)
        {
            return (
                <div className='PassJourney'>
                    <JourneyWhenEmpty info='您目前还没有过往行程，今后此类行程会显示在这里。' />
                </div>
            );
        }
        else
        {
            return (
                <div className='PassJourney'>
                    {
                        this.props.userJourneyList.map((v: UserRentListItem) =>
                        {
                            return (
                                <JourneyItem key={v.id} rentInfo={v} />
                            );
                        })
                    }
                </div>
            );
        }
    }
}


export function JourneyWhenEmpty(props: { info: string; })
{
    return (
        <div className='JourneyWhenEmpty'>
            <p>{props.info}</p>
            <img className='JourneyWhenEmpty' alt='JourneyWhenEmpty' src={JourneyWhenEmptyPng} />
        </div>
    );
}



@observer
export class JourneyItem extends Component<{ rentInfo: UserRentListItem; }, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    @observable houseInfo: HouseInfo;
    async componentDidMount()
    {
        this.houseInfo = await this.HouseStore.InitHouseInfo(this.props.rentInfo.hId);
    }
    render()
    {
        const { houseInfo } = this;
        const { rentInfo } = this.props;
        if (!this.houseInfo) return null;
        return (
            <div className='JourneyItem'>
                <img alt={this.props.rentInfo.id} src={CONST_HOST + '/' + houseInfo.baseInfo.hExhibitImg} />
                <div>
                    <h2>
                        <p>{moment(rentInfo.checkInDate).format('YYYY年MM月DD日')}-{moment(rentInfo.checkOutDate).format('YYYY年MM月DD日')}</p>
                        {houseInfo.baseInfo.hTitle}
                    </h2>
                    <div className='JourneyExhibitInfo'>
                        <img alt={this.props.rentInfo.id} src={CONST_HOST + '/' + houseInfo.baseInfo.hExhibitImg} />
                        <p>{houseInfo.baseInfo.hTitle}/{houseInfo.baseInfo.hMethod}/{houseInfo.baseInfo.hFeature}</p>
                        <Button icon={<RightOutlined />} type='link' />
                    </div>
                    <Divider style={{ margin: '0' }} />
                    <Button children='显示更多行程计划' size='large' type='link' style={{ fontWeight: "bold" }} />
                </div>
            </div>
        );
    }
}

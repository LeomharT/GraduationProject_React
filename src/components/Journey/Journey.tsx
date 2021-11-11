import { Tabs } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import JourneyWhenEmptyPng from '../../assets/img/JourneyWhenEmpty.png';
import '../../assets/scss/Journey.scss';
import { UserRentListItem } from '../../interfaces/UserInferface';
import UserStore from '../../redux/UserStore';
import HeadNavigate from '../Common/HeadNavigate';
import JourneyItem from './JourneyItem';
@observer
export default class Journey extends Component
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable userJourneyList: UserRentListItem[] = [];
    @observable commingJourneyList: UserRentListItem[] = [];
    async componentDidMount()
    {
        this.userJourneyList = await this.UserStore.InitCurrentUserRentList(this.UserStore.GetCurrentUserId(), true);
        this.commingJourneyList = await this.UserStore.InitCurrentUserRentList(this.UserStore.GetCurrentUserId());
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
                                <CommingJourney commingJourneyList={this.commingJourneyList} />
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
class CommingJourney extends Component<{ commingJourneyList: UserRentListItem[]; }, {}>
{
    render()
    {
        if (!this.props.commingJourneyList.length)
        {
            return (
                <div className='PassJourney'>
                    <JourneyWhenEmpty info='当您准备好开始规划下一次行程时，我们会随时为您提供帮助。' />
                </div>
            );
        }
        else
        {
            return (
                <div className='PassJourney'>
                    {
                        this.props.commingJourneyList.map((v: UserRentListItem) =>
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
class PastJourney extends Component<{ userJourneyList: UserRentListItem[]; }, {}>
{
    render()
    {
        if (!this.props.userJourneyList.length)
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

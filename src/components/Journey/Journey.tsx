import { Tabs } from 'antd';
import React, { Component } from 'react';
import JourneyWhenEmptyPng from '../../assets/img/JourneyWhenEmpty.png';
import '../../assets/scss/Journey.scss';
import HeadNavigate from '../Common/HeadNavigate';
export default class Journey extends Component
{
    render()
    {
        return (
            <div className='Journey'>
                <div className='JourneyContentWrapper'>
                    <HeadNavigate />
                    <div className='JourneyContent'>
                        <h1>行程</h1>
                        <Tabs size='large'>
                            <Tabs.TabPane tab='即将开始的行程' key='1'>
                                <CommingJourney />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab='过往行程' key='2'>
                                <PastJourney />
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
class PastJourney extends Component<{}, {}>
{
    render()
    {
        return (
            <div className='PassJourney'>
                <JourneyWhenEmpty info='您目前还没有过往行程，今后此类行程会显示在这里。' />
            </div>
        );
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

import { Radio } from 'antd';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import '../../assets/scss/Community.scss';
import HeadNavigate from '../Common/HeadNavigate';
import CommunityCrowd from './CommunityCrowd';

@observer
export default class Community extends Component<{}, {}>
{
    componentDidMount()
    {
    }
    render()
    {
        return (
            <div className='Community'>
                <HeadNavigate />
                <div className='C_Navi'>
                    <CommunityCrowd />
                </div>
                <div className='C_Main'>
                    <div className='StoryTabs'>
                        <Radio.Group
                            defaultValue='推荐'
                            buttonStyle='solid'
                            onChange={(e) =>
                            {
                                console.log(e.target.value);
                            }}>
                            <Radio.Button value='推荐'>
                                推荐
                            </Radio.Button>
                            <Radio.Button value='最热'>
                                最热
                            </Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
            </div>
        );
    }
}

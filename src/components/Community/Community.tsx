import { observer } from 'mobx-react';
import React, { Component } from 'react';
import '../../assets/scss/Community.scss';
import HeadNavigate from '../Common/HeadNavigate';
import CEditer from './CEditer';
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
                    <CEditer />
                </div>
            </div>
        );
    }
}

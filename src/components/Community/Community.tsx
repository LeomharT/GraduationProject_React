import { observer } from 'mobx-react';
import React, { Component } from 'react';
import '../../assets/scss/Community.scss';
import { AppIconTitle } from '../Common/AppIconTitle';
import HeadNavigate from '../Common/HeadNavigate';
import CommunityCrowd from './CommunityCrowd';

@observer
export default class Community extends Component<{}, {}>
{
    componentDidMount()
    {
        console.log('asd');
    }
    render()
    {
        return (
            <div className='Community'>
                <HeadNavigate />
                <div className='C_Navi'>
                    <div>
                        <AppIconTitle title='You+' />
                    </div>
                </div>
                <CommunityCrowd />
                <div className='C_Main'>

                </div>
            </div>
        );
    }
}

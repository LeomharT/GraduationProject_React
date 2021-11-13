import React from 'react';
import { Provider } from 'react-redux';
import '../../assets/scss/BackStage.scss';
import Aside from './Aside';
import Headers from './Headers';
import { globalStore } from './redux/Global/Global_Store';
export default function BackStage()
{
    return (
        <Provider store={globalStore}>
            <div className='BackStage'>
                <Aside />
                <main>
                    <Headers />
                </main>
            </div>
        </Provider>
    );
}

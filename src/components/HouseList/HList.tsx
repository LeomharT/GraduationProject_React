import { observer } from 'mobx-react';
import React, { Component } from 'react';
import HouseItem from './HouseItem';


@observer
export default class H_List extends Component<{}, {}>
{
    render()
    {
        return (
            <div className="HouseList">
                <HouseItem />
            </div>
        );
    }
}

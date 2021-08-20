import { observer } from 'mobx-react';
import React, { Component } from 'react';
import HFilter from './HFilter';
import HouseItem from './HouseItem';


@observer
export default class HouseExhibit extends Component<{}, {}>
{
    render()
    {
        return (
            <div className="HouseList">
                <HFilter />
                <HouseItem />
            </div>
        );
    }
}

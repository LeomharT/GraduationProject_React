import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';


interface HouseRepairProps extends RouteComponentProps
{

}
class HouseRepair extends Component<HouseRepairProps, {}>
{
    render()
    {
        return (
            <div className='HouseRepair'>
                我是房屋的维修列表
            </div>
        );
    }
}

export default withRouter(HouseRepair);

import { LeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { UserRentListItem } from '../../../interfaces/UserInferface';
import { RepairItem } from '../../Common/AppIconTitle';
import { LANGUAGE_REFER } from '../../Common/VariableGlobal';


interface HouseRepairProps extends RouteComponentProps
{

}
@observer
class HouseRepair extends Component<HouseRepairProps, {}>
{
    rentInfo: UserRentListItem | string;
    componentDidMount()
    {
        this.rentInfo = (this.props.location.state as { rentInfo: UserRentListItem | string; }).rentInfo;
        this.rentInfo = JSON.parse(this.rentInfo as string);
        console.log(this.rentInfo);
    }
    render()
    {
        return (
            <div className='HouseRepair'>
                <h1>
                    <Button type='link' icon={<LeftOutlined />}
                        onClick={() =>
                        {
                            this.props.history.goBack();
                        }}
                    />
                    房屋报修
                </h1>
                <RepairItem id='ok' value='ok' type={LANGUAGE_REFER.AirCondition} />
            </div>
        );
    }
}

export default withRouter(HouseRepair);

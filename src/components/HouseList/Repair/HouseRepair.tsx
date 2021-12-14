import { LeftOutlined } from '@ant-design/icons';
import { Button, Spin, Steps } from 'antd';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { UserRentListItem } from '../../../interfaces/UserInferface';
import HouseStore from '../../../redux/HouseStore';
import RepairStore from '../../../redux/RepairStore';
import { SpinStyle } from '../../Common/VariableGlobal';
import HouseItem from '../HouseItem';
import RepairConfirm from './RepairConfirm';
import RepairForm from './RepairForm';

const { Step } = Steps;

interface HouseRepairProps extends RouteComponentProps
{

}
@observer
class HouseRepair extends Component<HouseRepairProps, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    RepairStore: RepairStore = RepairStore.GetInstance();
    rentInfo: UserRentListItem | string;
    async componentDidMount()
    {
        this.RepairStore.currentStep = 0;

        this.rentInfo = (this.props.location.state as { rentInfo: UserRentListItem | string; }).rentInfo;
        this.rentInfo = JSON.parse(this.rentInfo as string);
        this.RepairStore.houseInfo = await this.HouseStore.InitHouseInfo((this.rentInfo as UserRentListItem).hId);
    }
    render()
    {
        const { houseInfo, currentStep } = this.RepairStore;
        if (!houseInfo) return (<Spin size='large' style={SpinStyle} />);
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
                <Steps current={currentStep}>
                    <Step title='第一步' description='确定需要维修的房屋' />
                    <Step title='第二步' description='填写报修表单' />
                    <Step title='第三步' description='确定报修' />
                </Steps>
                {currentStep === 0 && <HouseItem HouseInfo={houseInfo.baseInfo} />}
                <RepairForm />
                {currentStep === 2 && <RepairConfirm />}
                {
                    currentStep === 0 &&
                    <div className='RepairActions'>
                        <Button children='下一步' type='primary' onClick={this.RepairStore.Next} />
                    </div>
                }
            </div>
        );
    }
}

export default withRouter(HouseRepair);

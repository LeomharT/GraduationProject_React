import { Divider, Spin } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { HouseInfo } from '../../../interfaces/HouseListInterface';
import { UserRentListItem } from '../../../interfaces/UserInferface';
import HouseStore from '../../../redux/HouseStore';
import { AppIconTitle } from '../../Common/AppIconTitle';
import { SpinStyle } from '../../Common/VariableGlobal';

@observer
class HouseContract extends Component<RouteComponentProps, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    @observable houseInfo: HouseInfo;
    @observable loadingContract: boolean = false;
    async componentDidMount()
    {
        this.loadingContract = true;
        const { contractInfo } = this.props.location.state as { contractInfo: UserRentListItem; };
        this.houseInfo = await this.HouseStore.InitHouseInfo(contractInfo.hId);

        this.loadingContract = false;
    }
    render()
    {
        if (this.loadingContract) return <Spin size='large' style={SpinStyle} />;
        return (
            <div className='HouseContract'>
                <AppIconTitle title='优区生活' />
                <Divider />
                <p style={{ fontWeight: "bold" }}>本文件签署日期: 年 月 日</p>
                <h2 style={{ textAlign: 'center', fontWeight: "bold" }}>{'{房屋名称}'}房屋租赁合同</h2>
            </div>
        );
    }
}
export default withRouter(HouseContract);

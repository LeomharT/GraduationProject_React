import { LeftOutlined } from '@ant-design/icons';
import { Affix, Button, DatePicker, Divider, InputNumber, Spin } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment, { Moment } from 'moment';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { HouseInfo } from '../../../interfaces/HouseListInterface';
import HouseStore from '../../../redux/HouseStore';
import HouseItem from '../HouseItem';


declare interface ConfirmOrderProps extends RouteComponentProps
{

}
@observer
class ConfirmOrder extends Component<ConfirmOrderProps, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    @observable houseInfo: HouseInfo;
    @observable checkInDate: Moment = moment(Date.now());
    @observable checkInMonth: number = 1;
    async componentDidMount()
    {
        const { hId } = this.props.match.params as { hId: string; };
        this.houseInfo = await this.HouseStore.InitHouseInfo(hId);
        console.log(this.houseInfo);
    }
    render()
    {
        const { houseInfo } = this;
        const checkOutDate = moment(this.checkInDate);
        if (!houseInfo) return (<Spin size='large' style={{ position: "absolute", top: '40%', left: '50%', marginLeft: "-20px" }} />);
        return (
            <div className='ConfirmOrder'>
                <div className='OrderInfo'>
                    <div className='OrderInfo_Title'>
                        <Button
                            icon={<LeftOutlined />}
                            size='large'
                            type='link'
                            onClick={() =>
                            {
                                this.props.history.go(-1);
                            }}
                        />
                        <span>确定并支付</span>
                    </div>
                    <div className='OrderInfo_Content'>
                        <span>您的行程</span>
                        <div className='OrderInfo_Content_Item'>
                            <div>
                                日期
                                <div>
                                    入住日期：
                                    <DatePicker
                                        value={this.checkInDate}
                                        clearIcon={null}
                                        onChange={(e) =>
                                        {
                                            if (!e) return;
                                            this.checkInDate = e as Moment;
                                        }}
                                    />
                                    月份：
                                    <InputNumber
                                        value={this.checkInMonth}
                                        style={{ width: '60px' }}
                                        min={1}
                                        onChange={(e) =>
                                        {
                                            this.checkInMonth = e;
                                        }}
                                    />
                                </div>
                            </div>
                            {this.checkInDate.format("YYYY年MM月DD日")}~{checkOutDate.add(this.checkInMonth, 'M').format("YYYY年MM月DD日")}
                        </div>
                    </div>
                </div>

                <Affix offsetTop={30}>
                    <div className='OrderAmount'>
                        <HouseItem HouseInfo={houseInfo.baseInfo} />
                        <Divider orientation="left" className="DividerHouseInfo">价格详情</Divider>
                        <div className='OrderCharge'>

                        </div>
                    </div>
                </Affix>
            </div >
        );
    }
}


export default withRouter(ConfirmOrder);

import RightOutlined from "@ant-design/icons/lib/icons/RightOutlined";
import { Button, Divider } from "antd";
import { observable } from "mobx";
import { observer } from "mobx-react";
import moment from "moment";
import { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { HouseInfo } from "../../interfaces/HouseListInterface";
import { UserRentListItem } from "../../interfaces/UserInferface";
import HouseStore from "../../redux/HouseStore";
import { CONST_HOST } from "../Common/VariableGlobal";

interface JourneyItemProps extends RouteComponentProps
{
    rentInfo: UserRentListItem;
}
@observer
class JourneyItem extends Component<JourneyItemProps, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    @observable houseInfo: HouseInfo;
    async componentDidMount()
    {
        this.houseInfo = await this.HouseStore.InitHouseInfo(this.props.rentInfo.hId);
    }
    render()
    {
        const { houseInfo } = this;
        const { rentInfo } = this.props;
        if (!this.houseInfo) return null;
        return (
            <div className='JourneyItem'>
                <img alt={this.props.rentInfo.id} src={CONST_HOST + '/' + houseInfo.baseInfo.hExhibitImg} />
                <div>
                    <h2>
                        <p>{moment(rentInfo.checkInDate).format('YYYY年MM月DD日')}-{moment(rentInfo.checkOutDate).format('YYYY年MM月DD日')}</p>
                        {houseInfo.baseInfo.hTitle}
                    </h2>
                    <div className='JourneyExhibitInfo'>
                        <img alt={this.props.rentInfo.id} src={CONST_HOST + '/' + houseInfo.baseInfo.hExhibitImg} />
                        <p>{houseInfo.baseInfo.hTitle}/{houseInfo.baseInfo.hMethod}/{houseInfo.baseInfo.hFeature}</p>
                        <Button icon={<RightOutlined />} type='link' />
                    </div>
                    <Divider style={{ margin: '0' }} />
                    <Button children='显示更多行程计划' size='large' type='link' style={{ fontWeight: "bold" }}
                        onClick={() =>
                        {
                            //嗯,深拷贝一份,因为是纯数据所以没问题
                            const rInfo = JSON.parse(JSON.stringify(rentInfo));
                            const hInfo = JSON.parse(JSON.stringify(houseInfo));
                            this.props.history.push("/JourneyDetail", { rInfo, hInfo });
                        }}
                    />
                </div>
            </div>
        );
    }
}
export default withRouter(JourneyItem);

import { EnvironmentOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Tag } from 'antd';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import { HouseBaseInfo } from '../../interfaces/HouseListInterface';
import { VRAnimation } from '../Common/AppIconTitle';
const { Meta } = Card;

interface HouseItemProps extends RouteComponentProps
{
    HouseInfo: HouseBaseInfo;
}

export const RenderTags = (tags: Array<string>): React.ReactNode =>
{
    const HouseTags: { [index: string]: any; } = {
        onSell: <Tag color="#108ee9" key="onSellTag">在售</Tag>,
        business: <Tag color="#B199FF" key="businessTag">商业</Tag>,
        villa: <Tag color="#FB9252" key="villaTag">别墅</Tag>,
        living: <Tag color="#52c41a" key="livingTag">住宅</Tag>,
    };
    return (
        tags!.map((tag: string) =>
        {
            return (
                HouseTags[tag]
            );
        })
    );
};

@observer
class HouseItem extends Component<HouseItemProps, {}>
{
    render()
    {
        const { HouseInfo } = this.props;
        const RenderTitleAndTags = (hInfo: HouseBaseInfo): React.ReactNode =>
        {
            return (
                <>
                    {hInfo.hTitle}
                    {RenderTags(hInfo.hTags.split(","))}
                </>
            );
        };
        const RenderDetailAndRent = (hInfo: HouseBaseInfo): React.ReactNode =>
        {
            return (
                <div className='HosueItem_Detail'>
                    <div className="HInfo">
                        <div>
                            <EnvironmentOutlined />
                            {hInfo.hRegion}
                        </div>
                        <div>
                            <HomeOutlined />
                            户型：{hInfo.hLayout}
                        </div>
                        <div>
                            <UserOutlined />
                            房屋咨询：贝壳找房&nbsp;&nbsp;&nbsp;<Tag color="blue">向TA质询</Tag>
                        </div>
                        <div>
                            {hInfo.hFeature.split(",").map((f) =>
                            {
                                return (
                                    <Tag key={f} color='default' style={{ height: "30px", lineHeight: "30px" }}>{f}</Tag>
                                );
                            })}
                        </div>
                    </div>
                    <div className='HRent'>
                        {hInfo.hRent} 元/月
                    </div>
                </div>
            );
        };
        return (
            <Card
                className="HouseItem_Wrapper"
                cover={<img alt="封面" src={HouseInfo.hExhibitImg} />}
                bordered={false}
                hoverable
                onClick={() =>
                {
                    this.props.history.push(`/HouseList/DetailInfo/${1}`);
                }}
            >
                {HouseInfo.isVRed && <VRAnimation bottom="25px" left="25px" />}
                <Meta
                    title={RenderTitleAndTags(HouseInfo)}
                    description={RenderDetailAndRent(HouseInfo)}
                />
            </Card>
        );
    }
}


export default withRouter(HouseItem);

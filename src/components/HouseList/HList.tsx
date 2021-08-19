import { EnvironmentOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Tag } from 'antd';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
const { Meta } = Card;

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


/**
 * 房屋列表项
 */
@observer
class HouseItem extends Component<{}, {}>
{
    render()
    {
        const HouseTags: { [index: string]: any; } = {
            onSell: <Tag color="#108ee9" key="onSellTag">在售</Tag>,
            business: <Tag color="#B199FF" key="businessTag">商业</Tag>,
            villa: <Tag color="#FB9252" key="villaTag">别墅</Tag>,
            living: <Tag color="#52c41a" key="livingTag">住宅</Tag>,
        };
        const RenderTitleAndTags = (H_Title: string, tags: Array<string>): React.ReactNode =>
        {
            return (
                <>
                    {H_Title}
                    {tags.map((tag: string) =>
                    {
                        return (
                            HouseTags[tag]
                        );
                    })}
                </>
            );
        };
        const RenderDetailAndPrice = (): React.ReactNode =>
        {
            return (
                <div className='HosueItem_Detail'>
                    <div className="HInfo">
                        <div>
                            <EnvironmentOutlined />
                            马尾区/亭江镇/长洋路三盛雅居乐璞悦长滩
                        </div>
                        <div>
                            <HomeOutlined />
                            户型：3室/4室
                        </div>
                        <div>
                            <UserOutlined />
                            房屋质询：xx找房&nbsp;&nbsp;&nbsp;<Tag color="blue">向TA质询</Tag>
                        </div>
                        <div>
                            {['精装修', '新上', '随时看房', 'VR看房'].map((f) =>
                            {
                                return (
                                    <Tag color='default' style={{ height: "30px", lineHeight: "30px" }}>{f}</Tag>
                                );
                            })}
                        </div>
                    </div>
                    <div className='HPrice'>
                        1550 元/月
                    </div>
                </div>
            );
        };
        return (
            <Card
                className="HouseItem_Wrapper"
                cover={<img alt="封面" src='http://localhost:3065/img/cover.jpeg' />}
                bordered={false}
                hoverable
            >
                <Meta
                    title={RenderTitleAndTags("悦江湾", Object.keys(HouseTags))}
                    description={RenderDetailAndPrice()}
                />
            </Card>
        );
    }
}

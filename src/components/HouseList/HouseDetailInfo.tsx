import { LeftOutlined, LinkOutlined } from '@ant-design/icons';
import { Affix, Anchor, Button, Carousel, Spin } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { HouseCarousel, HouseDetailInfo } from '../../interfaces/HouseListInterface';
import { RenderTags } from './HouseItem';

interface DetailProps extends RouteComponentProps
{

}
const { Link } = Anchor;
@observer
class HouseDetail extends Component<DetailProps, {}>
{
    @observable houseDetailInfo: HouseDetailInfo;

    InitCarouseList = async (): Promise<HouseDetailInfo> =>
    {
        return (
            await (
                await
                    fetch(`http://localhost:3065/GetHouseDetailInfo?hId=${(this.props.match.params as any).HouseId}`)
            ).json()
        );
    };
    async componentDidMount()
    {
        this.houseDetailInfo = await this.InitCarouseList();
        console.log(this.houseDetailInfo);
    }
    render()
    {
        const { history } = this.props;
        const { houseDetailInfo } = this;
        if (!houseDetailInfo) return (<Spin size='large' style={{ position: "absolute", top: '40%', left: '50%', marginLeft: "-20px" }} />);
        return (
            <div className='HouseDetailInfo'>
                <div className="CarouselAndBaseInfo" id="CarouselAndBaseInfo">
                    <div className="HCarousel">
                        <div>
                            <Button
                                type='link'
                                icon={<LeftOutlined />}
                                onClick={() =>
                                {
                                    history.push("/HouseList/Exhibits");
                                }} />
                            <Button
                                icon={<LinkOutlined />}
                                onClick={() =>
                                {
                                    window.open("/VRScene");
                                }}
                            />
                            {houseDetailInfo.baseInfo.hTitle}
                            {RenderTags(houseDetailInfo.baseInfo.hTags.split(","))}
                        </div>
                        <Carousel autoplay>
                            {houseDetailInfo.carousel.map((c: HouseCarousel) =>
                            {
                                return (
                                    <img key={c.id} alt={c.id} src={c.url} />
                                );
                            })}
                        </Carousel>
                    </div>
                    <div className="HBaseInfo">

                    </div>
                </div>
                <Affix offsetTop={10}>
                    <div className="TargetBox">
                        <Anchor affix={false}>
                            <Link title="基本信息" href="#CarouselAndBaseInfo" />
                            <Link title="房屋信息" href="#CarouselAndBaseInfo" />
                        </Anchor>
                    </div>
                </Affix>
                <div className='HDetailInfo'>

                </div>
                <div className="HFacilities">

                </div>
                <div className="HRent">

                </div>
            </div>
        );
    }
}



export default withRouter(HouseDetail);

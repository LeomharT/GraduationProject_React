import { LeftOutlined, LinkOutlined } from '@ant-design/icons';
import { Affix, Anchor, Button, Carousel } from 'antd';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

interface DetailInfoProps extends RouteComponentProps
{

}

const { Link } = Anchor;
class HouseDetailInfo extends Component<DetailInfoProps, {}>
{
    componentDidMount()
    {
        console.log(this.props.match.params);
    }
    render()
    {
        const { history } = this.props;
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
                                    history.go(-1);
                                }} />
                            <Button
                                icon={<LinkOutlined />}
                                onClick={() =>
                                {
                                    window.open("/VRScene");
                                }}
                            />
                            哈哈哈😄什么titile
                        </div>
                        <Carousel>
                            <img alt="图片" src="http://localhost:3065/img/cover.jpeg" />
                            <img alt="图片" src="http://localhost:3065/img/cover.jpeg" />
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



export default withRouter(HouseDetailInfo);

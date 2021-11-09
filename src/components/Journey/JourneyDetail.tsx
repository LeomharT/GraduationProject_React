import { CloseOutlined, ProfileOutlined } from '@ant-design/icons';
import { Button, Carousel, Divider } from 'antd';
import moment from 'moment';
import React, { Component, createRef, RefObject } from 'react';
import ReactDOM from 'react-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import { HouseCarousel, HouseInfo } from '../../interfaces/HouseListInterface';
import { UserRentListItem } from '../../interfaces/UserInferface';
import HeadNavigate from '../Common/HeadNavigate';
import { CONST_HOST } from '../Common/VariableGlobal';

class JourneyDetail extends Component<RouteComponentProps, {}>
{
    tMapRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    state: { rInfo: UserRentListItem, hInfo: HouseInfo; } = this.props.location.state as { rInfo: UserRentListItem, hInfo: HouseInfo; };
    InitMap = () =>
    {
        const map = new TMap.Map(this.tMapRef.current, {
            center: new TMap.LatLng(
                parseFloat(this.state.hInfo.detailInfo.hLatitude),
                parseFloat(this.state.hInfo.detailInfo.hLongitude)),
            zoom: 15,
            pitch: 43.5,
            rotation: 45,
            viewMode: "2D"
        });
        const pngMarker = this.AddMapMarks(map);
        const infoWindow = this.AddInfoWindow(map);
        this.AddLabelInfo(map, this.state.rInfo);

        pngMarker.add({
            id: "1",
            styleId: "marker",
            position: new TMap.LatLng(
                parseFloat(this.state.hInfo.detailInfo.hLatitude),
                parseFloat(this.state.hInfo.detailInfo.hLongitude)),
            properties: {
                title: "position01"
            }
        });

        pngMarker.addListener('click', async (e: any) =>
        {
            map.easeTo({ center: new TMap.LatLng(e.geometry.position.lat, e.geometry.position.lng) });
            const houseInfo: HouseInfo = this.state.hInfo;
            infoWindow.open();
            infoWindow.setPosition(e.geometry.position);
            infoWindow.setContent(`
                <div class = 'MapInfoWindow' id = 'MapInfoWindow'>
                </div>
            `);
            const iw = document.querySelector("#MapInfoWindow") as HTMLDivElement;
            const iwChild = (
                <>
                    <Carousel autoplay>
                        {houseInfo.carousel.map((c: HouseCarousel) =>
                        {
                            return (
                                <img key={c.id} alt={c.id} src={`${CONST_HOST}/${c.url}`} />
                            );
                        })}
                    </Carousel>
                    <div className='iwInfo'>
                        {houseInfo.baseInfo.hTitle}·{houseInfo.baseInfo.hLayout}
                    </div>
                    <div className='iwInfo'>
                        {houseInfo.baseInfo.hRegion}-{houseInfo.baseInfo.hMethod}-{houseInfo.baseInfo.hFloor}-{houseInfo.detailInfo.Area}
                    </div>
                    <div className='iwInfo'>
                        &yen;{houseInfo.baseInfo.hRent}元/月
                    </div>
                    <Button
                        type='link'
                        icon={<ProfileOutlined />}
                        onClick={() =>
                        {
                            this.props.history.push(`/HouseList/DetailInfo/${houseInfo.detailInfo.hId}`);
                        }}
                    >
                        查看详情
                    </Button>
                </>
            );
            ReactDOM.render(iwChild, iw);
        });
    };
    //@ts-ignore
    AddMapMarks = (map: TMap) =>
    {
        const markers = new TMap.MultiMarker({
            map,
        });
        return markers;
    };
    //@ts-ignore
    AddInfoWindow = (map: TMap) =>
    {
        const infoWindow = new TMap.InfoWindow({
            map,
            position: new TMap.LatLng(26.081982, 119.296987),
            offset: { x: 0, y: -32 }
        });
        infoWindow.close();
        return infoWindow;
    };
    //@ts-ignore
    AddLabelInfo = (map: TMapm, rentInfo: UserRentListItem) =>
    {
        new TMap.MultiLabel({
            map,
            styles: {
                'label': new TMap.LabelStyle({
                    'color': '#2B2B2B',
                    'size': 20,
                    'offset': { x: 0, y: 5 },
                    'angle': 0,
                    'alignment': 'center',
                    'verticalAlignment': 'middle'
                }),
                'info': new TMap.LabelStyle({
                    'color': '#7D7D7D',
                    'size': 16,
                    'offset': { x: 0, y: 25 },
                    'angle': 0,
                    'alignment': 'center',
                    'verticalAlignment': 'middle',
                    'width': 10
                })
            },
            geometries: [{
                'id': 'label',
                'styleId': 'label',
                'position': new TMap.LatLng(
                    parseFloat(this.state.hInfo.detailInfo.hLatitude),
                    parseFloat(this.state.hInfo.detailInfo.hLongitude)),
                'content': '您的房源',

            }, {
                'id': 'infolabel',
                'styleId': 'info',
                'position': new TMap.LatLng(
                    parseFloat(this.state.hInfo.detailInfo.hLatitude),
                    parseFloat(this.state.hInfo.detailInfo.hLongitude)),
                'content': moment(rentInfo.checkInDate).format("YYYY年MM月DD日") + '-' + moment(rentInfo.checkOutDate).format("YYYY年MM月DD日"),
            }]
        });
    };
    componentDidMount()
    {
        this.InitMap();
    }
    render()
    {
        const { rInfo: rentInfo, hInfo } = this.state;
        return (
            <div className='JourneyDetail'>
                <HeadNavigate />
                <div className='JourneyDetailContentWrapper' >
                    <div className='JourneyDetailInfo'>
                        <div>
                            <div className='JourneyDetailInfoTitle'>
                                <Button type='link' size='large' icon={<CloseOutlined />} />
                                <span>您的房源预定</span>
                            </div>
                            <Divider />
                            <h2>{moment(rentInfo.checkInDate).format("YYYY年MM月DD日") + '-' + moment(rentInfo.checkOutDate).format("YYYY年MM月DD日")}</h2>
                            <h1>您入住了{hInfo.baseInfo.hTitle}</h1>
                            <Divider />
                            <div className='JourneyDetailInfoCarousel'>
                                <Carousel autoplay>
                                    {hInfo.carousel.map((c: HouseCarousel) =>
                                    {
                                        return (
                                            <img key={c.id} alt={c.id} src={`${CONST_HOST}/${c.url}`} />
                                        );
                                    })}
                                </Carousel>
                            </div>
                            <p style={{ fontWeight: "bold", fontSize: "25px", margin: "15px 0" }}>
                                {hInfo.baseInfo.hTitle}/{hInfo.baseInfo.hMethod}/{hInfo.baseInfo.hFeature}
                            </p>
                        </div>
                    </div>
                    <div ref={this.tMapRef} />
                </div>
            </div>
        );
    }
}


export default withRouter(JourneyDetail);

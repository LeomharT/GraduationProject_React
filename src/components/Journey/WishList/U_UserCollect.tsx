import { LeftOutlined } from '@ant-design/icons';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';
import ExclamationOutlined from '@ant-design/icons/lib/icons/ExclamationOutlined';
import ProfileOutlined from '@ant-design/icons/lib/icons/ProfileOutlined';
import { Button, Carousel, Divider, Empty, Popconfirm } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, createRef, RefObject } from 'react';
import ReactDOM from 'react-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import '../../../assets/scss/WishList.scss';
import { HouseBaseInfo, HouseCarousel, HouseInfo } from '../../../interfaces/HouseListInterface';
import HouseStore from '../../../redux/HouseStore';
import UserStore from '../../../redux/UserStore';
import HeadNavigate from '../../Common/HeadNavigate';
import { CONST_HOST } from '../../Common/VariableGlobal';
import HouseItem from '../../HouseList/HouseItem';

@observer
class U_UserCollect extends Component<RouteComponentProps, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    HouseStore: HouseStore = HouseStore.GetInstance();
    tMapRef: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    pngMarker: any;
    @observable userCollections: HouseBaseInfo[] = [];
    InitUserCollections = async () =>
    {
        const { id } = this.UserStore?.authInfo?.userInfo;
        this.userCollections = (await (await fetch(`${CONST_HOST}/GetAllUserCollections?id=${id}`)).json()) as HouseBaseInfo[];
    };
    InitMap = async () =>
    {
        const map = new TMap.Map(this.tMapRef.current, {
            center: new TMap.LatLng(26.100271, 119.295624),
            zoom: 12,
            pitch: 43.5,
            rotation: 45,
            viewMode: "2D"
        });
        this.pngMarker = await this.AddMapMarks(map);
        const infoWindow = this.AddInfoWindow(map);
        const data = this.GetUserCollectMarker(this.userCollections);
        this.pngMarker.add(data);
        this.pngMarker.addListener('click', async (e: any) =>
        {
            map.easeTo({ center: new TMap.LatLng(e.geometry.position.lat, e.geometry.position.lng) });
            const houseInfo: HouseInfo = await this.HouseStore.InitHouseInfo(e.geometry.hId);
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
                            this.props.history.push(`/HouseList/DetailInfo/${e.geometry.hId}`);
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
    AddMapMarks = async (map: TMap) =>
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
    GetUserCollectMarker = (h: HouseBaseInfo[]): MultiMarker[] =>
    {
        const data: MultiMarker[] = [];
        h.forEach((c, index) =>
        {
            let geometrie = {} as MultiMarker;
            Object.defineProperty(geometrie, 'id', {
                value: index,
                enumerable: true,
                configurable: true,
                writable: true
            });
            Object.defineProperty(geometrie, 'hId', {
                value: c.hId,
                enumerable: true,
                configurable: true,
                writable: true
            });
            Object.defineProperty(geometrie, 'position', {
                value: new TMap.LatLng(
                    //@ts-ignore
                    parseFloat(c.hLatitude),
                    //@ts-ignore
                    parseFloat(c.hLongitude)),
                enumerable: true,
                configurable: true,
                writable: true
            });
            Object.defineProperty(geometrie, 'properties', {
                value: { title: `props${index}` },
                enumerable: true,
                configurable: true,
                writable: true
            });
            data.push(geometrie);
        });
        return data;
    };
    async componentDidMount()
    {
        console.log(this.props);
        if (!this.UserStore.CheckForIsLogin()) return;
        await this.InitUserCollections();
        this.InitMap();
    }
    render()
    {
        const { userCollections, UserStore, HouseStore } = this;
        return (
            <div className='U_Collections'>
                <HeadNavigate />
                {(!userCollections.length)
                    ? (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂时没有收藏任何房源' />)
                    : <div className='WishList'>
                        <div className='ListContent'>
                            <h1>
                                <Button icon={<LeftOutlined />} type='link'
                                    onClick={() =>
                                    {
                                        this.props.history.push("/Home");
                                    }}
                                />
                                心愿单
                            </h1>
                            <Divider />
                            {userCollections.map((h: HouseBaseInfo) =>
                            {
                                return (
                                    <div className='U_CollectWrapper' key={h.hId}>
                                        <HouseItem HouseInfo={h} />
                                        <Popconfirm
                                            title='确定要删除吗?'
                                            placement='bottom'
                                            okType='danger'
                                            okText='确定'
                                            cancelText='取消'
                                            icon={
                                                <ExclamationOutlined style={{ color: 'red' }} />
                                            }
                                            onConfirm={async () =>
                                            {
                                                HouseStore.DeleteCurrentHouseFromUserCollections(
                                                    UserStore.authInfo.userInfo.id,
                                                    h.hId,
                                                    this.InitUserCollections
                                                );
                                                await this.InitUserCollections();
                                                this.pngMarker.setGeometries([]);
                                                const data = this.GetUserCollectMarker(this.userCollections);
                                                this.pngMarker.add(data);
                                            }}
                                        >
                                            <Button
                                                type='text'
                                                className='DeleteCollectBtn'
                                                danger
                                                size='large'
                                                icon={
                                                    <DeleteOutlined />
                                                } />
                                        </Popconfirm>
                                        <Divider />
                                    </div>
                                );
                            })}
                        </div>
                        <div
                            ref={this.tMapRef}
                            className='MapArea' />
                    </div>
                }
            </div>
        );
    }
}
export default withRouter(U_UserCollect);

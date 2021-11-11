import { Button } from 'antd';
import React, { Component, createRef, RefObject } from 'react';
import { HouseInfo } from '../../../interfaces/HouseListInterface';
import { UserRentListItem } from '../../../interfaces/UserInferface';
import MapStore from '../../../redux/MapStore';

export default class PositionInfo extends Component<{ houseInfo: HouseInfo, rentInfo: UserRentListItem; }, {}>
{
    MapStore: MapStore = MapStore.GetInstance();
    tMap: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    map: any;
    pngMarker: any;
    SetUpMap = () =>
    {
        const { MapStore, tMap } = this;
        this.map = MapStore.InitMap(tMap, this.props.houseInfo);
        this.pngMarker = MapStore.InitMarkers(this.map);
        this.pngMarker.add([
            {
                id: "1",
                styleId: "marker",
                position: new TMap.LatLng(
                    parseFloat(this.props.houseInfo.detailInfo.hLatitude),
                    parseFloat(this.props.houseInfo.detailInfo.hLongitude)),
                properties: {
                    title: "position01"
                }
            }
        ]);
        MapStore.AddLabelInfo(this.map, this.props.rentInfo, this.props.houseInfo);
    };
    componentDidMount()
    {
        if (this.props.houseInfo)
        {
            this.SetUpMap();
        }
    }
    render()
    {
        const { MapStore } = this;
        return (
            <div ref={this.tMap}>
                <Button children='显示路线'
                    style={{
                        position: "absolute", top: "0", left: '0',
                        zIndex: 9999,
                    }}
                    onClick={(e) =>
                    {
                        e.stopPropagation();
                        const userLocation = navigator.geolocation;
                        userLocation.getCurrentPosition(async (e) =>
                        {
                            console.log(e.coords.latitude, e.coords.longitude);
                            await MapStore.MakeJourneyRoute(this.map, e.coords.latitude + ',' + e.coords.longitude, this.props.houseInfo);
                            MapStore.MarkStart(e.coords.latitude + ',' + e.coords.longitude, this.pngMarker);
                        }, (err) =>
                        {
                            console.log(err);
                        });
                    }} />
            </div>
        );
    }
}

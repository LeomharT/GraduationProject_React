import { Button } from 'antd';
import React, { Component, createRef, RefObject } from 'react';
import { HouseInfo } from '../../../interfaces/HouseListInterface';
import { UserRentListItem } from '../../../interfaces/UserInferface';
import MapUtil from '../../../util/MapUtil';

export default class PositionInfo extends Component<{ houseInfo: HouseInfo, rentInfo: UserRentListItem; }, {}>
{
    MapUtil: MapUtil = MapUtil.GetInstance();
    tMap: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    map: any;
    pngMarker: any;
    SetUpMap = () =>
    {
        const { MapUtil, tMap } = this;
        this.map = MapUtil.InitMap(tMap, this.props.houseInfo);
        this.pngMarker = MapUtil.InitMarkers(this.map);
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
        MapUtil.AddLabelInfo(this.map, this.props.rentInfo, this.props.houseInfo);
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
        const { MapUtil } = this;
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
                            await MapUtil.MakeJourneyRoute(this.map, e.coords.latitude + ',' + e.coords.longitude, this.props.houseInfo);
                            MapUtil.MarkStart(e.coords.latitude + ',' + e.coords.longitude, this.pngMarker);
                        }, (err) =>
                        {
                            console.log(err);
                        });
                    }} />
            </div>
        );
    }
}

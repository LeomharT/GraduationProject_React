import { Button } from 'antd';
import React, { Component, createRef, RefObject } from 'react';
import { HouseInfo } from '../../../interfaces/HouseListInterface';

export default class PositionInfo extends Component<{ houseInfo: HouseInfo; }, {}>
{
    tMap: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    InitTMap = (houseDetailInfo: HouseInfo): void =>
    {
        if (!houseDetailInfo?.baseInfo) return;
        const map = new TMap.Map(this.tMap.current, {
            center: new TMap.LatLng(
                parseFloat(houseDetailInfo.detailInfo.hLatitude),
                parseFloat(houseDetailInfo.detailInfo.hLongitude)),
            zoom: 18,
            pitch: 43.5,
            rotation: 45,
            viewMode: "2D"
        });
        new TMap.MultiMarker({
            map: map,
            style: {
                markerStyle: new TMap.MarkerStyle({
                    width: 25,
                    height: 35,
                    anchor: { x: 16, y: 32 }
                })
            },
            geometries: [{
                id: "1",
                styled: "markerStyle",
                position: new TMap.LatLng(
                    parseFloat(houseDetailInfo.detailInfo.hLatitude),
                    parseFloat(houseDetailInfo.detailInfo.hLongitude)),
                properties: {
                    title: "position01"
                }
            }]
        });
    };
    componentDidMount()
    {
        if (this.props.houseInfo)
        {
            this.InitTMap(this.props.houseInfo);
        }
    }
    render()
    {
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

                    }} />
            </div>
        );
    }
}

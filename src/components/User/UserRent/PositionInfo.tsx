import { Button, message } from 'antd';
import React, { Component, createRef, RefObject } from 'react';
import { HouseInfo } from '../../../interfaces/HouseListInterface';

export default class PositionInfo extends Component<{ houseInfo: HouseInfo; }, {}>
{
    tMap: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    map: any;
    InitTMap = (houseDetailInfo: HouseInfo): void =>
    {
        if (!houseDetailInfo?.baseInfo) return;
        this.map = new TMap.Map(this.tMap.current, {
            center: new TMap.LatLng(
                parseFloat(houseDetailInfo.detailInfo.hLatitude),
                parseFloat(houseDetailInfo.detailInfo.hLongitude)),
            zoom: 18,
            pitch: 43.5,
            rotation: 45,
            viewMode: "2D"
        });
        const { map } = this;
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
    MakeJourneyRoute = async (start: string) =>
    {
        let url = 'https://apis.map.qq.com/ws/direction/v1/driving/';
        url += `?from=${start}`;
        url += `&to=${this.props.houseInfo.detailInfo.hLatitude},${this.props.houseInfo.detailInfo.hLongitude}`;  //终点坐标
        url += "&output=jsonp&callback=DrawLine";	//指定JSONP回调函数名
        url += "&key=JFABZ-OLL6V-LFTPW-UAAMN-U6WY6-PIB2B";

        const fun = `
            function DrawLine(ret)
            {
                const coords = ret.result.routes[0].polyline;
                const result = [];
                const kr = 1000000;
                for(let i = 2; i < coords.length; i++)
                {
                    coords[i] = Number(coords[i - 2]) + Number(coords[i]) / kr;
                }
                for (let i = 0; i < coords.length; i += 2) {
                    result.push(new TMap.LatLng(coords[i], coords[i+1]));
                }
                window.RouteResult = result;
            }
        `;
        const scriptfn = document.createElement("script");
        scriptfn.innerText = fun;
        document.body.appendChild(scriptfn);

        const script = document.createElement("script");
        script.src = url;
        document.body.appendChild(script);

        message.loading({ content: "正在为您规划路线", key: 'makeRoute' });

        setTimeout(() =>
        {
            //@ts-ignore
            console.log(window.RouteResult);
            new TMap.MultiPolyline({
                id: 'polyline-layer',
                map: this.map,
                styles: {
                    'style_blue': new TMap.PolylineStyle({
                        'color': '#3777FF',
                        'width': 8,
                        'borderWidth': 5,
                        'borderColor': '#FFF',
                        'lineCap': 'round',
                    })
                },
                //折线数据定义
                geometries: [
                    {
                        'id': 'pl_1',//折线唯一标识，删除时使用
                        'styleId': 'style_blue',//绑定样式名
                        //@ts-ignore
                        'paths': window.RouteResult
                    }
                ]
            });
            message.success({ content: "规划成功", key: 'makeRoute', duration: 2 });
            document.body.removeChild(scriptfn);
            document.body.removeChild(script);

        }, 2000);

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
                        const userLocation = navigator.geolocation;
                        userLocation.getCurrentPosition(async (e) =>
                        {
                            console.log(e.coords.latitude, e.coords.longitude);
                            await this.MakeJourneyRoute(e.coords.latitude + ',' + e.coords.longitude);
                        }, (err) =>
                        {
                            console.log(err);
                        });
                    }} />
            </div>
        );
    }
}

import { message } from "antd";
import moment from "moment";
import React from "react";
import { HouseInfo } from "../interfaces/HouseListInterface";
import { UserRentListItem } from "../interfaces/UserInferface";

export default class MapUtil
{
    InitMap = (mapEl: React.RefObject<HTMLDivElement>, hInfo: HouseInfo): any =>
    {
        if (!hInfo) return;
        return (
            new TMap.Map(mapEl.current, {
                center: new TMap.LatLng(
                    parseFloat(hInfo.detailInfo.hLatitude),
                    parseFloat(hInfo.detailInfo.hLongitude)),
                zoom: 18,
                pitch: 43.5,
                rotation: 45,
                viewMode: "2D"
            })
        );
    };
    InitMarkers = (map: any) =>
    {
        return (
            new TMap.MultiMarker({
                map,
                styles: {
                    "startMark": new TMap.MarkerStyle({
                        "width": 25,
                        "height": 35,
                        "anchor": { x: 16, y: 32 },
                        "src": 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/start.png'
                    }),
                },
            })
        );
    };
    InitInfoWindow = (map: any) =>
    {
        const infoWindow = new TMap.InfoWindow({
            map,
            position: new TMap.LatLng(26.081982, 119.296987),
            offset: { x: 0, y: -32 }
        });
        infoWindow.close();
        return infoWindow;
    };
    AddLabelInfo = (map: any, rentInfo: UserRentListItem, hInfo: HouseInfo) =>
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
                    parseFloat(hInfo.detailInfo.hLatitude),
                    parseFloat(hInfo.detailInfo.hLongitude)),
                'content': '????????????',

            }, {
                'id': 'infolabel',
                'styleId': 'info',
                'position': new TMap.LatLng(
                    parseFloat(hInfo.detailInfo.hLatitude),
                    parseFloat(hInfo.detailInfo.hLongitude)),
                'content': moment(rentInfo.checkInDate).format("YYYY???MM???DD???") + '-' + moment(rentInfo.checkOutDate).format("YYYY???MM???DD???"),
            }]
        });
    };
    MakeJourneyRoute = async (map: any, start: string, hInfo: HouseInfo) =>
    {
        let url = 'https://apis.map.qq.com/ws/direction/v1/driving/';
        url += `?from=${start}`;
        url += `&to=${hInfo.detailInfo.hLatitude},${hInfo.detailInfo.hLongitude}`;  //????????????
        url += "&output=jsonp&callback=DrawLine";	//??????JSONP???????????????????????????cb
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

        message.loading({ content: "????????????????????????", key: 'makeRoute' });

        setTimeout(() =>
        {
            //@ts-ignore
            console.log(window.RouteResult);
            new TMap.MultiPolyline({
                id: 'polyline-layer',
                map: map,
                styles: {
                    'style_blue': new TMap.PolylineStyle({
                        'color': '#3777FF',
                        'width': 8,
                        'borderWidth': 5,
                        'borderColor': '#FFF',
                        'lineCap': 'round',
                    })
                },
                //??????????????????
                geometries: [
                    {
                        'id': 'pl_1',//????????????????????????????????????
                        'styleId': 'style_blue',//???????????????
                        //@ts-ignore
                        'paths': window.RouteResult
                    }
                ]
            });
            message.success({ content: "????????????", key: 'makeRoute', duration: 2 });
            document.body.removeChild(scriptfn);
            document.body.removeChild(script);
            map.easeTo({
                center: new TMap.LatLng(
                    parseFloat(start.split(",")[0]),
                    parseFloat(start.split(",")[1]))
            });
        }, 2000);

    };
    MarkStart = (start: string, pngMarker: any) =>
    {
        pngMarker.add(
            [
                {
                    id: "startPoint",
                    styleId: 'startMark',
                    position: new TMap.LatLng(
                        parseFloat(start.split(",")[0]),
                        parseFloat(start.split(",")[1])),
                    properties: {
                        title: "startPoint"
                    }
                },
            ]
        );
    };
    private static _SingleInstance: MapUtil;
    static GetInstance()
    {
        if (this._SingleInstance) return this._SingleInstance;
        this._SingleInstance = new MapUtil();
        return this._SingleInstance;
    }
}

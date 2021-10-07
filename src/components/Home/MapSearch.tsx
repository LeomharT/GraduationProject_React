import { LeftOutlined, ProfileOutlined } from '@ant-design/icons';
import { Button, Carousel, Input } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import '../../assets/scss/MapSearch.scss';
import { HouseCarousel, HouseInfo } from '../../interfaces/HouseListInterface';
import HouseStore from '../../redux/HouseStore';
import { CONST_HOST } from '../Common/VariableGlobal';


const MapSearchWrapper = styled.div`
position: relative;
`;
const { Search } = Input;
const shapOfGuLou = '26.101265,119.240802;26.105967,119.243465;26.111208,119.249473;26.112364,119.254623;26.112846,119.257951;26.112595,119.256557;26.113327,119.259006;26.113481,119.258963;26.113443,119.259135;26.114599,119.260722;26.115292,119.261495;26.116448,119.261924;26.117373,119.262954;26.122459,119.274809;26.122459,119.283736;26.121535,119.299175;26.120148,119.303123;26.073437,119.311019;26.072974,119.303638;26.075595,119.303638;26.072512,119.283897;26.070661,119.284412;26.056474,119.271022';
const shapeOfCangShan = '26.100880,119.225712;26.104733,119.234467;26.104579,119.238758;26.099646,119.242020;26.094097,119.245110;26.082842,119.250603;26.074362,119.255753;26.048301,119.291287;26.046450,119.292317;26.044599,119.306050;26.046142,119.310169;26.049226,119.318066;26.050768,119.326649;26.047684,119.346047;26.045216,119.352741;26.041515,119.360981;26.032723,119.370766;26.019612,119.384670;26.010355,119.402695;26.002333,119.428101;25.994464,119.437199;25.989218,119.440289;25.970700,119.432736;25.964064,119.427071;25.958971,119.395142;25.957890,119.386730;25.963292,119.379349;25.967614,119.372483;25.971009,119.369908;25.973015,119.359951;25.974558,119.345360;25.977490,119.325276;25.978108,119.315148;25.982120,119.286480;25.990452,119.269657;25.996778,119.262963;26.013904,119.248371;26.025011,119.240647;26.044754,119.233780;26.082380,119.222622;26.097488,119.222965';
const shapeOfTaiJiang = '26.056937,119.271537;26.064956,119.281150;26.069813,119.291874;26.072049,119.291101;26.072820,119.319774;26.069659,119.321053;26.069775,119.322813;26.060253,119.323714;26.060253,119.348179;26.057785,119.360023;26.053082,119.364744;26.042286,119.367662;26.037890,119.367233;26.049535,119.338313;26.049535,119.315482;26.042903,119.302264';
const shapeOfJinAn = '26.110437,119.317283;26.086851,119.320201;26.066652,119.335479;26.056783,119.364661;26.056783,119.367751;26.062334,119.370498;26.067886,119.372558;26.082688,119.370498;26.097797,119.370841;26.120302,119.376678;26.135097,119.367408;26.137255,119.358825;26.137871,119.347838;26.138179,119.337882;26.138179,119.330329;26.135714,119.324492;26.130782,119.317283';
@observer
class MapSearch extends Component<RouteComponentProps, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    tMapRef = React.createRef<HTMLDivElement>();
    @observable markers: any[] = [];
    InitMapArea = async () =>
    {
        /**
         * 初始化地图
         */
        const map = new TMap.Map(this.tMapRef.current, {
            center: new TMap.LatLng(26.081982, 119.296987),
            zoom: 12.5,
            viewMode: "2D"
        });
        this.AddMapLabel(map);
        this.AddMapRegionShap(map);
        const pngMarker = await this.AddMapMarks(map);
        const infoWindow = this.AddInfoWindow(map);

        const svgDom = document.querySelector("#svgDom") as HTMLElement;
        const positions = await this.GetAppMarks();

        pngMarker.addListener('click', async (e: any) =>
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
        map.addListener('zoom_changed', async (e: any) =>
        {
            pngMarker.setGeometries([]);
            infoWindow.close();
            if (svgDom.style.display !== 'block')
            {
                svgDom.style.display = 'block';
            }
            if (e.zoom > 16)
            {
                pngMarker.add(positions);
                if (svgDom.style.display !== 'none')
                {
                    svgDom.style.display = 'none';
                }
            }
        });
    };
    //@ts-ignore
    AddMapRegionShap = (map: TMap): void =>
    {
        const { DrawShapOfRegion } = this;
        const polyonStyles = new TMap.PolygonStyle({
            'color': 'rgba(41,91,255,0.16)',
            'showBorder': true,
            'borderColor': 'rgba(41,91,255,1)',
            'borderWidth': 2,
        });
        const polygon = new TMap.MultiPolygon({
            id: 'polygon-layer',
            map: map,
            //多边形样式
            styles: {
                'polygon': polyonStyles
            },
            geometries: []
        });
        //@ts-ignore
        const marker = new SvgMarker({
            map,
            options: [
                {
                    position: new TMap.LatLng(26.099142, 119.271437),
                    id: 0,
                },
                {
                    position: new TMap.LatLng(26.012901, 119.293605),
                    id: 1
                },
                {
                    position: new TMap.LatLng(26.053496, 119.332036),
                    id: 2,
                },
                {
                    position: new TMap.LatLng(26.102418, 119.345718),
                    id: 3,
                }
            ]
        });
        marker.on('mouseenter', function (e: any, region: any)
        {
            switch (region)
            {
                case "鼓楼区": {
                    polygon.add([{
                        'id': 'shapeGulou',
                        'styleId': 'polygon',
                        'paths': DrawShapOfRegion(shapOfGuLou)
                    }]);
                    break;
                }
                case "仓山区": {
                    polygon.add([{
                        'id': 'shapeCangShang',
                        'styleId': 'polygon',
                        'paths': DrawShapOfRegion(shapeOfCangShan)
                    }]);
                    break;
                }
                case '台江区': {
                    polygon.add([{
                        'id': 'shapeTaiJiang',
                        'styleId': 'polygon',
                        'paths': DrawShapOfRegion(shapeOfTaiJiang)
                    }]);
                    break;
                }
                case '晋安区': {
                    polygon.add([{
                        'id': 'shapeJinAn',
                        'styleId': 'polygon',
                        'paths': DrawShapOfRegion(shapeOfJinAn)
                    }]);
                    break;
                }
                default: {
                    break;
                }
            }
            e.setAttribute('style', 'fill: #fe615a;stroke:red; opacity:0.9;');
        });
        marker.on('mouseleave', function (e: any, region: any)
        {
            switch (region)
            {
                case "鼓楼区": {
                    polygon.remove(['shapeGulou']);
                    break;
                }
                case "仓山区": {
                    polygon.remove(['shapeCangShang']);
                    break;
                }
                case '台江区': {
                    polygon.remove(['shapeTaiJiang']);
                    break;
                }
                case '晋安区': {
                    polygon.remove(['shapeJinAn']);
                    break;
                }
                default: {
                    break;
                }
            }
            e.setAttribute('style', 'fill: #1890ff;stroke:#FFFFFF;opacity:0.9;');
        });
    };
    //@ts-ignore
    AddMapLabel = (map: TMap) =>
    {
        const { history } = this.props;
        const labelStyles = new TMap.LabelStyle({
            'color': 'rgba(0,0,0,0)',
            'size': 20,
            'offset': { x: 0, y: 0 },
            'angle': 0,
            'alignment': 'center',
            'verticalAlignment': 'middle'
        });
        const labelGuLou = new TMap.MultiLabel({
            id: 'labelGuLou',
            map,
            styles: {
                'label': labelStyles
            },
            //文字标记数据
            geometries: [{
                'id': 'label_1',
                'styleId': 'label',
                'position': new TMap.LatLng(26.099148, 119.271446),
                'content': '鼓楼区',
            }]
        });
        const labelCangShang = new TMap.MultiLabel({
            id: 'labelCangShang',
            map,
            styles: {
                'label': labelStyles
            },
            geometries: [{
                'id': 'label_1',
                'styleId': 'label',
                'position': new TMap.LatLng(26.012901, 119.293605),
                'content': '仓山区',
            }]
        });
        const labelTaiJiang = new TMap.MultiLabel({
            id: 'labelTaiJiang',
            map,
            styles: {
                'label': labelStyles
            },
            geometries: [{
                'id': 'label_1',
                'styleId': 'label',
                'position': new TMap.LatLng(26.053496, 119.332036),
                'content': '台江区',
            }]
        });
        const labelJinAn = new TMap.MultiLabel({
            id: 'labelJinAn',
            map,
            styles: {
                'label': labelStyles
            },
            geometries: [{
                'id': 'label_1',
                'styleId': 'label',
                'position': new TMap.LatLng(26.102418, 119.345718),
                'content': '晋安区',
            }]
        });
        labelGuLou.on("click", () =>
        {
            history.push("HouseList/Exhibits/鼓楼区");
        });
        labelCangShang.on("click", () =>
        {
            history.push("HouseList/Exhibits/仓山区");
        });
        labelTaiJiang.on('click', () =>
        {
            history.push("HouseList/Exhibits/台江区");
        });
        labelJinAn.on('click', () =>
        {
            history.push("HouseList/Exhibits/晋安区");
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
    GetAppMarks = async (): Promise<any[]> =>
    {
        let locations = (await (await fetch(`${CONST_HOST}/GetAllHouseLocation`)).json()) as Array<any>;
        const data: any = [];
        locations.forEach((l, index: number) =>
        {
            let geometrie = {};
            Object.defineProperty(geometrie, 'id', {
                value: index,
                enumerable: true,
                configurable: true,
                writable: true
            });
            Object.defineProperty(geometrie, 'hId', {
                value: l.hId,
                enumerable: true,
                configurable: true,
                writable: true
            });
            Object.defineProperty(geometrie, 'position', {
                value: new TMap.LatLng(
                    parseFloat(l.hLatitude),
                    parseFloat(l.hLongitude)),
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
    //@ts-ignore
    DrawShapOfRegion = (polygon: string): Array<TMap.LatLng> =>
    {
        //@ts-ignore
        const shapeOfRegionArray: TMap.LatLng[] = [];
        for (let p of polygon.split(";"))
        {
            shapeOfRegionArray.push(
                new TMap.LatLng(parseFloat(p.split(",")[0]), parseFloat(p.split(",")[1]))
            );
        }
        return shapeOfRegionArray;
    };
    componentDidMount = async () =>
    {
        await this.InitMapArea();
    };
    render()
    {
        return (
            <MapSearchWrapper>
                <div style={{ position: "absolute", zIndex: 3, width: "500px", }} className="inputContainer">
                    <Button
                        icon={<LeftOutlined />}
                        type='link'
                        onClick={() =>
                        {
                            this.props.history.go(-1);
                        }}
                    />
                    <Search
                        size='large'
                        allowClear
                        enterButton
                        placeholder="请输入地址"
                        onSearch={(e) =>
                        {
                            if (!e) return;
                            console.log(e);
                        }} />
                </div>
                <div
                    ref={this.tMapRef}
                    className="mapContainer"
                    onMouseDown={(e: React.MouseEvent) =>
                    {
                        (e.target as HTMLDivElement).style.cursor = 'grabbing';
                    }}
                    onMouseUp={(e: React.MouseEvent) =>
                    {
                        (e.target as HTMLDivElement).style.cursor = 'grab';
                    }}
                />
            </MapSearchWrapper>
        );
    }
}


export default withRouter(MapSearch);

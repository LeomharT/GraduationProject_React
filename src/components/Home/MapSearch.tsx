import { LeftOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import '../../assets/scss/MapSearch.scss';

const MapSearchWrapper = styled.div`
position: relative;
`;
const { Search } = Input;

@observer
class MapSearch extends Component<RouteComponentProps, {}>
{
    tMapRef = React.createRef<HTMLDivElement>();
    InitMapArea = () =>
    {
        const { history } = this.props;
        /**
         * 初始化地图
         */
        const map = new TMap.Map(this.tMapRef.current, {
            center: new TMap.LatLng(26.081982, 119.296987),
            zoom: 12.5,
            viewMode: "2D"
        });
        const circleStyles = new TMap.CircleStyle({
            'color': 'rgba(41,91,255,0.16)',
            'showBorder': true,
            'borderColor': 'rgba(41,91,255,1)',
            'borderWidth': 2,
        });
        const labelStyles = new TMap.LabelStyle({
            'color': '#3777FF',
            'size': 20,
            'offset': { x: 0, y: 0 },
            'angle': 0,
            'alignment': 'center',
            'verticalAlignment': 'middle'
        });
        new TMap.MultiCircle({
            map,
            styles: {
                'circle': circleStyles
            },
            geometries: [{
                styleId: 'circle',
                center: new TMap.LatLng(26.099148, 119.271446),
                radius: 850,
            }],
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
        new TMap.MultiCircle({
            map,
            styles: {
                'circle': circleStyles,
            },
            geometries: [{
                styleId: 'circle',
                center: new TMap.LatLng(26.046922, 119.274346),
                radius: 850,
            }],
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
                'position': new TMap.LatLng(26.046922, 119.274346),
                'content': '仓山区',
            }]
        });
        new TMap.MultiCircle({
            map,
            styles: {
                'circle': circleStyles,
            },
            geometries: [{
                styleId: 'circle',
                center: new TMap.LatLng(26.053346, 119.333938),
                radius: 850,
            }],
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
                'position': new TMap.LatLng(26.053346, 119.333938),
                'content': '台江区',
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
    };
    componentDidMount = () =>
    {
        this.InitMapArea();
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
                <div ref={this.tMapRef} className="mapContainer" />
            </MapSearchWrapper>
        );
    }
}


export default withRouter(MapSearch);

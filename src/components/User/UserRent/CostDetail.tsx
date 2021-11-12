import { PayCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Divider, Progress, Switch } from 'antd';
import * as echarts from 'echarts';
import React, { Component, createRef, RefObject } from 'react';
import { UserRentListItem } from '../../../interfaces/UserInferface';
import { IconFont } from '../../HouseList/RentAndPay/ConfirmOrder';

export const FormatNum = (str: string): string =>
{
    let newStr = "";
    let count = 0;
    // 当数字是整数
    if (str.indexOf(".") === -1)
    {
        for (let i = str.length - 1; i >= 0; i--)
        {
            if (count % 3 === 0 && count !== 0)
            {
                newStr = str.charAt(i) + "," + newStr;
            } else
            {
                newStr = str.charAt(i) + newStr;
            }
            count++;
        }
        str = newStr + ".00"; //自动补小数点后两位
        return str;
    }
    // 当数字带有小数
    else
    {
        for (let i = str.indexOf(".") - 1; i >= 0; i--)
        {
            if (count % 3 === 0 && count !== 0)
            {
                newStr = str.charAt(i) + "," + newStr;
            } else
            {
                newStr = str.charAt(i) + newStr; //逐个字符相接起来
            }
            count++;
        }
        str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
        return str;
    }
};
enum EcharState
{
    bar = 'bar',
    pie = 'pie',
}

export default class CostDetail extends Component<{ rentInfo: UserRentListItem; }, {}>
{
    echartsEl: RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    echart: echarts.ECharts | undefined = undefined;
    InitEchart = (state: EcharState): void =>
    {
        if (!this.echart)
            this.echart = echarts.init(this.echartsEl.current as HTMLElement);
        const option: echarts.EChartsOption = {
            title: {
                text: "费用详情"
            },
            tooltip: {
                show: true,
                trigger: 'item',
            }
        };
        switch (state)
        {
            case EcharState.bar:
                Object.assign(option, {
                    xAxis: {
                        data: ['房租', '水费', '电费', '停车费']
                    },
                    yAxis: {},
                    series: {
                        type: "bar",
                        data: [parseInt(this.props.rentInfo.totalAmount), 200, 300, 400]
                    }
                } as echarts.EChartsOption);
                break;
            case EcharState.pie:
                Object.assign(option, {
                    series: [
                        {
                            type: 'pie',
                            data: [
                                {
                                    value: parseInt(this.props.rentInfo.totalAmount),
                                    name: "房租",
                                },
                                {
                                    value: 200,
                                    name: '水费'
                                },
                                {
                                    value: 300,
                                    name: '电费'
                                },
                                {
                                    value: 400,
                                    name: '停车费'
                                },
                            ],
                        }
                    ],
                } as echarts.EChartsOption);
                break;
            default:
                break;
        }
        this.echart.clear();
        this.echart.setOption(option);
    };
    componentDidMount()
    {
        this.InitEchart(EcharState.pie);
    }
    render()
    {
        const { rentInfo } = this.props;
        return (
            <div className='CostDetail'>
                <div className='CostItem'>
                    <Button size='large' icon={<PayCircleOutlined />} type='primary' />
                    <span>房屋金额</span>
                    <Progress percent={100} size='default' />
                    <div>&yen;{FormatNum(parseFloat(rentInfo.totalAmount).toFixed(2))}</div>
                </div>
                <Divider />
                <div className='CostItem'>
                    <Button size='large' icon={<IconFont type='icon-houserentshuifei' />} type='primary' />
                    <span>水费</span>
                    <Progress percent={60} size='default' />
                    <div>&yen;60/&yen;100<Button children='缴费' type='link' /></div>
                </div>
                <Divider />
                <div className='CostItem'>
                    <Button size='large' icon={<ThunderboltOutlined />} type='primary' />
                    <span>电费</span>
                    <Progress percent={40} size='default' />
                    <div>&yen;40/&yen;100<Button children='缴费' type='link' /></div>
                </div>
                <Divider />
                <div className='CostItem'>
                    <Button size='large' icon={<IconFont type='icon-houserenttingchejiaofei' />} type='primary' />
                    <span>停车费</span>
                    <Progress percent={70} size='default' />
                    <div>&yen;70/&yen;100<Button children='缴费' type='link' /></div>
                </div>
                <div className='EchartsArea' ref={this.echartsEl}>
                </div>
                <Switch
                    style={{ width: "30px" }} checkedChildren='柱' unCheckedChildren='饼'
                    onChange={(e) =>
                    {
                        if (e)
                            this.InitEchart(EcharState.bar);
                        else
                            this.InitEchart(EcharState.pie);
                    }} />
            </div>
        );
    }
}

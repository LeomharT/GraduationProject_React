import { Divider } from 'antd';
import React, { Component } from 'react';
import Footer_CustomerService from '../../assets/img/Footer_CustomerService.svg';
import Footer_Indicator from '../../assets/img/Footer_Indicator.svg';
import Footer_Save from '../../assets/img/Footer_Save.svg';

export default class Footer extends Component<{}, {}>
{
    render()
    {
        return (
            <div className='Footer' >
                <Divider />
                <h1>优区生活居住保障</h1>
                <div className='F_Assure'>
                    <div>
                        <img alt='icon' src={Footer_Indicator} />
                        <p><span>安心房源保障</span>人工审核所有中国房源页面信息，入住更放心</p>
                    </div>
                    <div>
                        <img alt='icon' src={Footer_CustomerService} />
                        <p><span>专业中文客服</span> 中国大陆支持热线（+86）400-022-1666，境外旅行支持专线 +86-10-8783-3463</p>
                    </div> <div>
                        <img alt='icon' src={Footer_Save} />
                        <p><span>旅行安全保障</span> 多重风险控制设计，全方位保障您的行程安全</p>
                    </div>
                </div>
            </div>
        );
    }
}

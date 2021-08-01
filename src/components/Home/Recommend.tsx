import React, { Component } from 'react';
import RecommendImg from '../../assets/img/Recommend.png';
export default class Recommend extends Component<{}, {}>
{
    render()
    {
        return (
            <div className='HomeRecommend'>
                <div className="RecommendTitle">
                    <p>精品好房</p>
                    <span>好房源那么多,我们为您精选</span>
                </div>
                <div className='RecommendContent'>
                    <div className="Content_Img">
                        <img alt="推荐图片" src={RecommendImg} />
                    </div>

                </div>
            </div>
        );
    }
}

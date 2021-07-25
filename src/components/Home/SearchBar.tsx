import { Input } from 'antd';
import React, { Component } from 'react';


const { Search } = Input;
export default class SearchBar extends Component
{

    render()
    {
        const options = [
            { value: '鼓楼' },
            { value: '台江' },
            { value: 'Wall Street' },
        ];
        return (
            <div className='HomeSearch'>
                <span>
                    家是长途跋涉寻觅到的地方
                </span>
                <Search
                    style={{ width: "600px" }}
                    size='large'
                    placeholder="请输入区域"
                    onSearch={() => { console.log('ok'); }}
                />
            </div>
        );
    }
}

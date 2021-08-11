import { EnvironmentOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React, { Component } from 'react';
import HouseSearch from '../../assets/img/HouseSearch.gif';
import HouseSearchBar from '../../assets/img/HouseSearchBar.gif';



const { Search } = Input;
export default class SearchBar extends Component
{

    render()
    {
        return (
            <div className='HomeSearch'>
                <main className='SearchBar'>
                    <div className='SearchImg' >
                        <img src={HouseSearchBar} alt="searching" />
                    </div>
                    <div className='SearchTxt'>
                        <span>
                            家是长途跋涉寻觅到的地方(现在未必了)
                        </span>
                        <div className='SearchInput'>
                            <Search
                                size='large'
                                placeholder="请输入区域开始找房"
                                enterButton
                                onSearch={() => { console.log('ok'); }}
                            />
                            <EnvironmentOutlined
                                className='MapIcon'
                                onClick={() =>
                                {
                                    globalThis.alert("我点了地图");
                                }}
                            />
                        </div>
                    </div>
                </main>
                <img alt='HouseSearch' src={HouseSearch} />
            </div>
        );
    }
}

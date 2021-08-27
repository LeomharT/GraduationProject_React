import { Input } from 'antd';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import HouseSearchBar from '../../assets/img/House searching.gif';
import HouseMark from '../../assets/img/HouseMark.svg';
import HouseSearch from '../../assets/img/HouseSearch.gif';

const { Search } = Input;
declare interface SearchBarProps extends RouteComponentProps
{

}
class SearchBar extends Component<SearchBarProps, {}>
{
    render()
    {
        const { history } = this.props;
        return (
            <div className='HomeSearch'>
                <main className='SearchBar'>
                    <div className='SearchImg' >
                        <img draggable={false} src={HouseSearchBar} alt="searching" />
                        <div >
                            <span>
                                连接全球人与社区
                            </span>
                            <span>
                                快速的找到真实的、可靠的房源信息。连接每一个家的故事。让房子再次回到居住的基本属性。
                            </span>
                        </div>
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
                                onSearch={(e) =>
                                {
                                    if (!e) return;
                                    history.push(`/HouseList/Exhibits/${e}`);
                                }}
                            />
                            <img
                                className='MapIcon'
                                alt="地图图标"
                                draggable={false}
                                src={HouseMark}
                                onClick={() =>
                                {
                                    history.push("/MapSearch");
                                }}
                            />
                        </div>
                    </div>
                </main>
                <img draggable={false} alt='HouseSearch' src={HouseSearch} />
            </div>
        );
    }
}
export default withRouter(SearchBar);

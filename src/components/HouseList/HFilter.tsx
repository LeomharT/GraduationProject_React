import { Collapse } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { Component } from 'react';
import AppIconTitle from '../Common/AppIconTitle';

const { Panel } = Collapse;
const Filters = {

};
export default class H_Filter extends Component<{}, {}>
{
    async componentDidMount()
    {
        let response = await fetch("http://localhost:3065/HouseParams");
        console.log(await response.json());
    }
    render()
    {
        return (
            <div className="HFilter">
                <div className="HSearch">
                    <AppIconTitle title='贝壳租房' />
                    <Search
                        size='large'
                        style={{ width: "700px", margin: "20px 0" }}
                        placeholder="请输入区域开始找房"
                        onSearch={() => { console.log('ok'); }}
                    />
                </div>
                <div className="VisibleOption">
                    我是显示出来的选项
                </div>
                <Collapse ghost>
                    <Panel header="更多选项" key='MoreOption'>
                        我是隐藏的选项哦
                    </Panel>
                </Collapse>
            </div>
        );
    }
}

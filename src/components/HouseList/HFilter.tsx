import { Collapse, Form, Radio } from 'antd';
import Search from 'antd/lib/input/Search';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { HouseParams } from '../../interfaces/HouseListInterface';
import AppIconTitle from '../Common/AppIconTitle';

const { Panel } = Collapse;

@observer
export default class H_Filter extends Component<{}, {}>
{
    @observable HouseParams: HouseParams[] = [];
    async componentDidMount()
    {
        this.HouseParams = await (await fetch("http://localhost:3065/HouseParams", { method: "POST" })).json();
        console.log(this.HouseParams);
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
                <Form>
                    <div className="VisibleOption">
                        {this.HouseParams.slice(0, 5).map((params: HouseParams, indexP: number) =>
                        {
                            return (
                                <Form.Item
                                    key={indexP}
                                    label={params.params_label}
                                    name={params.params_name}
                                >
                                    <Radio.Group>
                                        {params.params_enums.map((enums: string, indexE: number) =>
                                        {
                                            return (
                                                <Radio.Button key={indexE} value={enums}>
                                                    {enums}
                                                </Radio.Button>
                                            );
                                        })}
                                    </Radio.Group>
                                </Form.Item>
                            );
                        })}
                    </div>
                    <Collapse ghost>
                        <Panel header="更多选项" key='MoreOption'>
                            {this.HouseParams.slice(5).map((params: HouseParams, indexP: number) =>
                            {
                                return (
                                    <Form.Item
                                        key={indexP}
                                        label={params.params_label}
                                        name={params.params_name}
                                    >
                                        <Radio.Group>
                                            {params.params_enums.map((enums: string, indexE: number) =>
                                            {
                                                return (
                                                    <Radio.Button key={indexE} value={enums}>
                                                        {enums}
                                                    </Radio.Button>
                                                );
                                            })}
                                        </Radio.Group>
                                    </Form.Item>
                                );
                            })}
                        </Panel>
                    </Collapse>
                </Form>
            </div>
        );
    }
}

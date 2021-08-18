import { Collapse, Form, FormInstance, Radio } from 'antd';
import Search from 'antd/lib/input/Search';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FieldData } from 'rc-field-form/lib/interface';
import React, { Component, createRef } from 'react';
import { HouseParams } from '../../interfaces/HouseListInterface';
import AppIconTitle from '../Common/AppIconTitle';

const { Panel } = Collapse;

@observer
export default class H_Filter extends Component<{}, {}>
{
    @observable HouseParams: HouseParams[] = [];
    filterForm = createRef<FormInstance>();
    @action
    filterSelected = (changedValue: FieldData[], allValue: FieldData[]) =>
    {
        console.log(allValue[0].value);
    };
    async componentDidMount()
    {
        this.HouseParams = await (await fetch("http://localhost:3065/HouseParams", { method: "POST" })).json();
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
                <Form
                    ref={this.filterForm}
                    onFieldsChange={this.filterSelected}
                >
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

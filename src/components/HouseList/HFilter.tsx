import { Button, Collapse, Form, FormInstance, Radio } from 'antd';
import Search from 'antd/lib/input/Search';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FieldData } from 'rc-field-form/lib/interface';
import React, { Component, createRef } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { HouseParams } from '../../interfaces/HouseListInterface';
import { AppIconTitle } from '../Common/AppIconTitle';

const { Panel } = Collapse;

@observer
class H_Filter extends Component<RouteComponentProps, {}>
{
    @observable HouseParams: HouseParams[] = [];
    filterForm = createRef<FormInstance>();
    @action
    filterSelected = (changedValue: FieldData[], allValue: FieldData[]) =>
    {
        for (let v of allValue)
        {
            if (!v.value) continue;
            console.log(v);
        }
    };
    async componentDidMount()
    {
        const { filterForm } = this;
        const { match } = this.props;
        this.HouseParams = await (
            await fetch("http://localhost:3065/HouseParams", { method: "POST" })
        ).json();
        //@ts-ignore
        if (!match.params.region) return;
        filterForm.current!.setFieldsValue({
            //@ts-ignore
            region: match.params.region
        });
    }
    render()
    {
        const { filterForm } = this;
        const { history } = this.props;
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
                    ref={filterForm}
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
                    <div className="TotalAndClean">
                        <span>
                            以为您找到500套福州租房
                        </span>
                        <Button
                            type='link'
                            onClick={() =>
                            {
                                filterForm.current!.resetFields();
                                if (history.location.pathname !== "/HouseList/Exhibits")
                                {
                                    history.push("/HouseList/Exhibits");
                                }
                            }}
                        >清除所有
                        </Button>
                    </div>
                </Form>
            </div>
        );
    }
}
export default withRouter(H_Filter);

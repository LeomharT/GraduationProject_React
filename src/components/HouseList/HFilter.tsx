import { Button, Collapse, Form, FormInstance, Radio } from 'antd';
import Search from 'antd/lib/input/Search';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FieldData } from 'rc-field-form/lib/interface';
import React, { Component, createRef } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { HouseParams } from '../../interfaces/HouseListInterface';
import HouseStore from '../../redux/HouseStore';
import { AppIconTitle } from '../Common/AppIconTitle';
import { CONST_HOST } from '../Common/VariableGlobal';

const { Panel } = Collapse;

@observer
class H_Filter extends Component<RouteComponentProps, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    filterForm = createRef<FormInstance>();
    @observable HouseParams: HouseParams[] = [];

    @action
    FilterSelected = (changedValue: FieldData[], allValue: FieldData[]): void =>
    {
        const { HouseStore } = this;
        for (let v of allValue)
        {
            if (!v.touched) continue;
            HouseStore.HouseFilterParams.set(v.name.toString(), v.value);
        }
        HouseStore.InitHouseList(HouseStore.HouseFilterParams);
    };
    async componentDidMount()
    {
        const { filterForm, HouseStore } = this;
        const { match } = this.props;
        this.HouseParams = await (
            await fetch(`${CONST_HOST}/HouseParams`, { method: "POST" })
        ).json();
        /**
         * 获取地图搜索那边的数据
         */
        //@ts-ignore
        if (match.params.hRegion)
        {
            filterForm.current!.setFieldsValue({
                //@ts-ignore
                hRegion: match.params.hRegion
            });
            //@ts-ignore
            HouseStore.HouseFilterParams.set("hRegion", match.params.hRegion);
            HouseStore.InitHouseList(HouseStore.HouseFilterParams);
        }
    }
    render()
    {
        const { filterForm, HouseStore } = this;
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
                    onFieldsChange={this.FilterSelected}
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
                            以为您找到{
                                <span style={{ color: "#fe615a", fontSize: '30px' }}>
                                    {HouseStore.HouseExhibitList?.count.toString()}
                                </span>
                            }套福州租房
                        </span>
                        <Button
                            type='link'
                            onClick={() =>
                            {
                                filterForm.current!.resetFields();
                                HouseStore.HouseFilterParams = new FormData();
                                HouseStore.InitHouseList(HouseStore.HouseFilterParams);
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

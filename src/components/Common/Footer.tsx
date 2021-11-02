import { Button, Divider, Modal, Tabs } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import Footer_CustomerService from '../../assets/img/Footer_CustomerService.svg';
import Footer_Indicator from '../../assets/img/Footer_Indicator.svg';
import Footer_Save from '../../assets/img/Footer_Save.svg';
import fscs from '../../assets/img/fs-cs.png';
import fshouse from '../../assets/img/fs-house.png';
import fssafety from '../../assets/img/fs-safety.png';

const { TabPane } = Tabs;
@observer
export default class Footer extends Component<{}, {}>
{
    @observable isFullSecurityOpen: boolean = false;
    @observable currentTagsIndex: number = 1;
    render()
    {
        return (
            <div className='Footer'>
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
                <Modal
                    width={1000}
                    className='FullSecurity'
                    visible={this.isFullSecurityOpen}
                    footer={false}
                    onCancel={() => this.isFullSecurityOpen = false}
                    maskClosable
                >
                    <div className='FullSecurityContent'
                        onScroll={(e) =>
                        {
                            const el = e.target as HTMLDivElement;
                            if (el.scrollTop < 350)
                            {
                                this.currentTagsIndex = 1;
                            }
                            if (el.scrollTop >= 550)
                            {
                                this.currentTagsIndex = 2;
                            }
                            if (el.scrollTop >= 850)
                            {
                                this.currentTagsIndex = 3;
                            }
                            console.log(this.currentTagsIndex);
                        }}
                    >
                        <h1>
                            优区生活居住保障
                            <p>全方位保障计划 · 无忧出行</p>
                        </h1>
                        <Tabs activeKey={this.currentTagsIndex.toString()} onTabClick={(e) =>
                        {
                            this.currentTagsIndex = parseInt(e);
                            const el = document.querySelector(`#tabInfo${e}`);
                            console.log(el);
                            el?.scrollIntoView({ block: "end" });
                        }}>
                            <TabPane tab="安心房源保障" key="1" />
                            <TabPane tab="专业中文客服" key="2" />
                            <TabPane tab="居住安全保障" key="3" />
                        </Tabs>
                        <div className='TabHouseSecurity'>
                            <div id='tabInfo1'>
                                <img alt='房源保障' src={fshouse} />
                                <div>
                                    <h1>
                                        安心房源保障
                                        <p>人工审核所有中国房源页面信息，入住更放心</p>
                                    </h1>
                                    <div>
                                        <span>入住真实可靠</span>
                                        若发现房源严重不符合描述并影响入住，经核实与协调仍无法入住，我们将最高全额退款并补偿最高首晚房费金额的礼金券
                                    </div>
                                    <div>
                                        <span>旅居一尘不染</span>
                                        若入住时发现房间未经打扫或有明显清洁问题，经核实与协调仍无法入住，我们将最高全额退款并补偿最高首晚房费金额的礼金券
                                    </div>
                                    <div>
                                        <span>费用透明安全</span>
                                        若房东无故取消订单或提出不合理的站外收款，经核实与协调仍无法入住，我们将最高全额退款并补偿最高首晚房费金额的礼金券
                                    </div>
                                </div>
                            </div>
                            <div id='tabInfo2'>
                                <div>
                                    <h1>
                                        专业中文客服
                                        <p>(86) 400-022-1666、(86) 010-8783-3463</p>
                                    </h1>
                                    <div>
                                        <span>全方位中文服务</span>
                                        无论遇到任何问题，您都可以通过客服电话、网站或 APP 等多重渠道，联系我们专业的中文客服团队
                                    </div>
                                    <div>
                                        <span>复杂问题，随时响应</span>
                                        我们为您解决各种问题，包括协助重新预订、退款等；还设有最高保额 100 万元人民币的中国房屋财产险以及分别最高保额 500 万元人民币的中国房东责任险和中国体验责任险计划，在您入住和参与体验期间提供全面的保险支持
                                    </div>
                                    <div>
                                        <span>多种语言，全球支持</span>
                                        除了中文，我们也提供 11 种语言的国际化的客服支持，确保您在世界各地的一切问题都能随时解决
                                    </div>
                                </div>
                                <img alt='专业客服' src={fscs} />
                            </div>
                            <div id='tabInfo3'>
                                <img alt='安全保障' src={fssafety} />
                                <div>
                                    <h1>
                                        旅行安全保障
                                        <p>多重风险控制设计，全方位保障您的旅程安全</p>
                                    </h1>
                                    <div>
                                        <span>实人实名，多重验证</span>
                                        在中国房东上线房源与房客预订时，均需提供真实姓名与身份信息。每一位中国房东都经过实名验证，预订更放心
                                    </div>
                                    <div>
                                        <span>紧急情况，安全保障</span>
                                        通过多种方式搭建安全架构，提供了全球紧急报警功能，遇到任何紧急安全问题，都能快速获取帮助
                                    </div>
                                    <div>
                                        <span>特殊状况，全面保护</span>
                                        由于超出控制范围的意外情况或重大自然灾害等不可抗因素需要取消预订时，经核实后我们将最高提供全额退款
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                <Button
                    size='large'
                    style={{ alignSelf: "flex-start", fontSize: "20px", padding: "10px 0 10px 0" }}
                    children='查看全方面保障计划'
                    type='link'
                    onClick={() => this.isFullSecurityOpen = !this.isFullSecurityOpen} />
                <Divider style={{ marginTop: "100px" }} />
            </div>
        );
    }
}

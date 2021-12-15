import { Button, Divider, Spin } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { CSSProperties } from 'styled-components';
import stamp from '../../../assets/img/stamp.png';
import { HouseInfo } from '../../../interfaces/HouseListInterface';
import { UserRentListItem } from '../../../interfaces/UserInferface';
import HouseStore from '../../../redux/HouseStore';
import { AppIconTitle } from '../../Common/AppIconTitle';
import { LANGUAGE_REFER, SpinStyle, toChinesNum } from '../../Common/VariableGlobal';
import { FormatNum } from './CostDetail';

@observer
class HouseContract extends Component<RouteComponentProps, {}>
{
    HouseStore: HouseStore = HouseStore.GetInstance();
    contractInfo = (this.props.location.state as { contractInfo: UserRentListItem; }).contractInfo;
    @observable houseInfo: HouseInfo;
    ExportPDF = async () =>
    {
        const canvas = await html2canvas(document.querySelector('.HouseContract') as HTMLDivElement);
        const jspdf = new jsPDF();
        jspdf.addImage(canvas.toDataURL(), 'JPEG', 25, 0, 150, 400);
        jspdf.addPage();
        jspdf.addImage(canvas.toDataURL(), 'JPEG', 25, -297, 150, 400);
        jspdf.save(`${new Date().toLocaleString('chinese', { hour12: false })}`);
    };
    async componentDidMount()
    {
        this.houseInfo = await this.HouseStore.InitHouseInfo(this.contractInfo.hId);
    }
    render()
    {
        const { contractInfo, houseInfo } = this;
        if (!this.houseInfo) return <Spin size='large' style={SpinStyle} />;
        return (
            <div className='HouseContract'>
                <Button type='link' children='导出为PDF' onClick={this.ExportPDF} />
                <div className='ContractHeader'>
                    <AppIconTitle title='优区生活' />
                    <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
                        由优区生活拥有和运营
                        <span style={{ position: "absolute", right: "0", bottom: "0", fontWeight: "bold", fontSize: '14px' }}>FUZHOU1.0版本</span>
                    </h2>
                </div>
                <Divider />
                <p style={{ fontWeight: "bold" }}>本文件签署日期:{moment(contractInfo.sendPayDate).format('YYYY年MM月DD日')}</p>
                <h2 style={{ textAlign: 'center', fontWeight: "bold" }}>{houseInfo.baseInfo.hTitle}房屋租赁合同</h2>
                <div className='ContractContent'>
                    <p>出租人（甲方）：<span style={{ borderBottom: "2px solid black", paddingBottom: "2px" }}>{houseInfo.baseInfo.hTitle.substr(0, 2)}社区</span></p>
                    <p>承租人（乙方）：<span style={{ borderBottom: "2px solid black", paddingBottom: "2px" }}>{contractInfo.realName}</span></p>
                    <p style={{ marginBottom: "20px" }}>依据《中华人民共和国民法典》及有关法律、法规的规定，甲方与乙方在丙方的中介服务下，在平等、自愿的基础上，
                        就房屋租赁的有关事宜达成协议如下：
                    </p>
                    <div className='ContractItem Part1'>
                        <h4 className='ContractItemTitle'>
                            第一条 租赁房屋基本情况
                        </h4>
                        <p>
                            （一）租赁的<span style={{ fontWeight: "bold" }}>房屋</span>坐落于福州市，房屋所属行政区域： {houseInfo.baseInfo.hRegion} 。
                        </p>
                        <p>
                            （二）租赁房屋建筑面积 {houseInfo.detailInfo.Area} 平方米，户型：{houseInfo.baseInfo.hLayout}。
                        </p>
                        <p>
                            （三）租赁房屋装修情况：精装。
                        </p>
                        <p>
                            （四）家具家电：{Object.keys(houseInfo.detailInfo).map((key: string): React.ReactNode =>
                            {
                                if (!key.includes('is')) return null;
                                if (houseInfo.detailInfo[key])
                                {
                                    return (
                                        //@ts-ignore
                                        <span key={key}>{LANGUAGE_REFER[key.substr(2)]}</span>
                                    );
                                }
                                return null;
                            })}
                        </p>
                        <p>
                            （五）房屋权属状况：甲方持有（ 房屋权属证件 公有住房租赁凭证 房屋买卖合同 其他房屋来源证明文
                            件 ），编号/权证号： / ，房屋（ 是 否 ）已设定了抵押。
                        </p>
                        <p>
                            （六）房屋规划设计用途为： 住宅 。
                        </p>
                        <p>
                            （七）甲方承诺，其出租的房屋未改变房屋原设计使用功能，且不存在下列情形之一：
                        </p>
                        <p style={{ textIndent: "2rem" }}>1.将成套房内原设计为居住空间的房间分隔为若干小间出租的；</p>
                        <p style={{ textIndent: "2rem" }}>2.将成套房内原始设计为客厅、厨房、卫生间、阳台、地下储藏室及其他非居住空间出租供人居住的。</p>
                        <p style={{ textIndent: "2rem" }}>3.出租的成套房内增设明显多于原设计数量的卫生间、电表、水表等设施的。</p>
                        <p style={{ textIndent: "2rem" }}>4.其他随意改变成套房内使用功能的。</p>
                    </div>
                    <div className='ContractItem Part2'>
                        <h4 className='ContractItemTitle'>
                            第二条 房屋租赁用途
                        </h4>
                        <p>（一）乙方向甲方承诺，租赁该房屋作为 住宅 使用。</p>
                        <p>（二）乙方保证，在租赁期内未征得甲方书面同意以及按规定须经有关部门审批而未核准前，不擅自改变上述约定的使用用途。</p>
                        <p>（三）乙方应遵守福州市人民政府关于福州市暂住人员登记相关管理规定，其暂住人员租赁住房应在按照规定期限内向暂住地派出所办理暂住手续。</p>
                    </div>
                    <div className='ContractItem Part3'>
                        <h4 className='ContractItemTitle'>
                            第三条  租赁期限
                        </h4>
                        <p>
                            （一）房屋租赁期自<span style={{ borderBottom: "2px solid black" }}>{moment(contractInfo.checkInDate).format('YYYY年MM月DD日')}</span>起至<span style={{ borderBottom: "2px solid black" }}>{moment(contractInfo.checkOutDate).format('YYYY年MM月DD日')}</span>止，
                            共计 {moment(contractInfo.checkOutDate).diff(moment(contractInfo.checkInDate), 'M')} 个月。甲方应于
                            <span style={{ borderBottom: "2px solid black" }}>{moment(contractInfo.checkInDate).format('YYYY年MM月DD日')}</span>前将房屋按约定条件交付给乙方。
                        </p>
                        <p>
                            （二）租赁期满或合同解除后，甲方有权收回房屋，乙方应按照原状返还房屋及其附属物品、设备设施。甲、乙双方应
                            对房屋和附属物品、设备设施及水电使用等情况进行验收，结清各自应当承担的费用。乙方继续承租的，应提前三十日
                            向甲方提出续租要求,协商一致后双方重新签订房屋租赁合同。
                        </p>
                    </div>
                    <div className='ContractItem Part4'>
                        <h4 className='ContractItemTitle'>
                            第四条  租金费用
                        </h4>
                        <p>
                            （一）租金标准及支付：
                        </p>
                        <p style={{ textIndent: "2rem" }}>
                            1、月租金为人民币（小写） {FormatNum(houseInfo.baseInfo.hRent)}，（大写） {toChinesNum(houseInfo.baseInfo.hRent)}元，
                            租金共计人民币（小写） {FormatNum(parseFloat(contractInfo.totalAmount).toFixed(2))} ，(大写) {toChinesNum(parseFloat(contractInfo.totalAmount).toFixed(2))} 。租金乙方按照 月 向甲方支付。
                        </p>
                        <p>
                            2、租金支付方式和时间：
                            支付方式： 第三方平台支付（微信、支付宝等）。
                            各期支付租金的日期为每月{moment(contractInfo.checkInDate).format('DD')}日 。
                        </p>
                    </div>
                    <div className='ContractItem Part5'>
                        <h4 className='ContractItemTitle'>
                            第五条   其他相关费用的承担方式
                        </h4>
                        <p>
                            租赁期内的下列费用中：
                        </p>
                        <p>
                            甲方承担：<span style={{ textDecoration: "line-through" }}>
                                水费 电费 电话费 有线电视费 燃气费 物业管理费 上网费 车位费 开具房租
                                发票的费用（如需要） 其他费用
                            </span>
                        </p>
                        <p>
                            乙方承担：水费 电费 电话费 有线电视费 燃气费 物业管理费 上网费 车位费 开具房租
                            发票的费用（如需要） 其他费用
                        </p>
                    </div>
                    <div className='ContractItem Part6'>
                        <h4 className='ContractItemTitle'>
                            第六条 房屋维护及维修
                        </h4>
                        <p>
                            （一）甲方应保证出租房屋的建筑结构和设备设施符合建筑、消防、治安、卫生等方面的安全条件，不得危及人身安全；
                            乙方保证遵守国家、福州市的法律法规规定以及房屋所在小区的物业管理规约。
                        </p>
                        <p>
                            （二）租赁期内，甲、乙双方应共同保障该房屋及其附属物品、设备设施处于适用和安全的状态：
                        </p>
                        <p style={{ textIndent: "2rem" }}>
                            1、对于该房屋及其附属物品、设备设施因自然属性或合理使用而导致的损耗，乙方应及时通知甲方修复。甲方应在接到乙方通知后的七日内进行维修。逾期不维修的，乙方可代为维修，费用由甲方承担。
                        </p>
                        <p style={{ textIndent: "2rem" }}>
                            2、因乙方保管不当或不合理使用，致使该房屋及其附属物品、设备设施发生损坏或故障的，乙方应负责维修或承担赔偿责任。
                        </p>
                    </div>
                    <div className='ContractItem Part7'>
                        <h4 className='ContractItemTitle'>
                            第七条 合同解除
                        </h4>
                        <p>
                            （一）经甲、乙双方协商一致，可以解除本合同。
                        </p>
                        <p>
                            （二）因不可抗力导致本合同无法继续履行的，本合同自行解除
                        </p>
                        <p>
                            （三）甲方有下列情形之一的，乙方有权单方解除本合同：
                        </p>
                        <p style={{ textIndent: "2rem" }}>1、 甲方不具有出租该房屋的权利。</p>
                        <p style={{ textIndent: "2rem" }}>2、 迟延交付房屋达十日的。</p>
                        <p style={{ textIndent: "2rem" }}>3、 交付的房屋严重不符合合同约定或影响乙方安全、健康的。</p>
                        <p style={{ textIndent: "2rem" }}>4、 不承担约定的维修义务，致使乙方无法正常使用房屋的。</p>
                        <p style={{ textIndent: "2rem" }}>5、 签署本合同后未到起租日，甲方拒绝出租该房屋的。</p>
                        <p>
                            （四）乙方有下列情形之一的，甲方有权单方解除合同，收回房屋：
                        </p>
                        <p style={{ textIndent: "2rem" }}>1、 不按照约定支付租金达十日的。
                        </p>
                        <p style={{ textIndent: "2rem" }}>2、 欠缴各项费用的金额相当于壹个月房屋租金的。
                        </p>
                        <p style={{ textIndent: "2rem" }}>3、 擅自改变房屋用途的。</p>
                        <p style={{ textIndent: "2rem" }}>4、 擅自拆改变动或损坏房屋主体结构的。</p>
                        <p style={{ textIndent: "2rem" }}>5、 保管不当或不合理使用导致附属物品、设备设施损坏并拒不赔偿的。</p>
                        <p style={{ textIndent: "2rem" }}>6、 利用房屋从事违法活动、损害公共利益或者妨碍他人正常工作、生活的。</p>
                        <p style={{ textIndent: "2rem" }}>7、 未经甲方书面同意将房屋转租给第三人的。</p>
                        <p style={{ textIndent: "2rem" }}>8、 签署本合同后未到起租日，乙方拒绝承租该房屋的。</p>
                    </div>
                    <div className='ContractItem Part8'>
                        <h4 className='ContractItemTitle'>
                            第八条 违约责任
                        </h4>
                        <p>
                            （一）甲方有第七条第三款约定的情形之一导致乙方解除合同或提前收回房屋的，应向乙方支付违约金，违约金标准为 本
                            合同第四条第（一）款约定的一个月租金 人民币（小写） 2,700.00 ，（大写） 贰仟柒佰元整 ；若由此给乙方造成损
                            失，且甲方所支付的违约金不足抵付实际损失的，甲方还应向乙方支付造成实际损失与违约金的差额部分
                        </p>
                        <p>
                            （二）乙方有第九条第四款约定的情形之一导致甲方解除合同或提前退租的，应向甲方支付违约金，违约金标准为 本合
                            同第四条第（一）款约定的一个月租金 人民币（小写） 2,700.00 ，（大写） 贰仟柒佰元整 ；若由此给甲方造成损
                            失，且乙方所支付的违约金不足抵付实际损失的，乙方还应向甲方支付造成实际损失与违约金的差额部分。
                        </p>
                        <p>
                            （三）合同期内，任一方未经对方书面同意（包括但不限于微信、短信、邮件等）提前终止本合同的，则视为该方违约，
                            违约方除应提前30日告知守约方外，还须按照 本合同第四条第（一）款约定的一个月的租金标准 人民币（小写）
                            2,700.00 ，（大写） 贰仟柒佰元整 向守约方支付违约金；若由此给守约方造成损失，且违约方所支付的违约金不足抵付
                            守约方实际损失的，则违约方还应向守约方支付造成实际损失与违约金的差额部分，但合同另有约定除外。
                        </p>
                        <p>
                            （四）因甲方未按约定履行维修义务造成乙方人身、财产损失的，甲方应承担赔偿责任。
                        </p>
                        <p>
                            （五）甲方未按约定时间交付该房屋或者乙方不按约定支付租金但未达到解除合同条件的，以及乙方未按约定时间返还房
                            屋的，每逾期一日违约方应按日租金的两倍向守约方支付违约金。
                        </p>
                        <p>
                            （六）丙方提供虚假信息、隐瞒重要事实或有恶意串通行为的，除退还已收取的中介报酬外，还应赔偿由此给甲方或乙方
                            造成的损失。
                        </p>
                        <p>
                            （七）任何一方由代理人签订合同的，需保证：甲乙双方代理人均保证已取得该方的真实授权代为签订本合同；因甲乙双
                            方任何一方代理人的保证不真实，导致本合同被认定无效或撤销的，该代理人应向对方支付与月租金等额的赔偿金；支付
                            的赔偿金低于对方实际损失的，还应赔偿对方实际损失与赔偿金的差额部分。
                        </p>
                    </div>
                    <div className='ContractItem Part9'>
                        <h4 className='ContractItemTitle'>
                            第九条 争议解决及合同生效
                        </h4>
                        <p>
                            （一）本合同项下发生的争议，由三方当事人协商解决；协商不成的，各方均可向房屋所在地的人民法院提起诉讼。因不
                            可抗力因素甲乙双方无法履行本合同以及造成的损失，双方互不承担责任。
                        </p>
                        <p>
                            （二）本合同经三方签字盖章后生效。本合同（及附件）一式三份，其中甲方执一份，乙方执一份，丙方执一份，均具有
                            同等法律效力。
                        </p>
                    </div>
                    <div className='ContractItem Part9'>
                        <h4 className='ContractItemTitle'>
                            第九条 其他约定事项
                        </h4>
                        <p>本合同最终解释权归优区生活网站所有</p>
                    </div>
                    <div className='ContractSignature'>
                        <div>
                            <p>出租人（甲方）签章: <span style={{ width: "150px", display: "inline-block", fontSize: "20px", borderBottom: "2px solid black" }}>优区生活</span></p>
                            <p>证件名称及编号：<span style={spanLineStyle}></span></p>
                            <p>委托代理人：<span style={spanLineStyle}></span></p>
                            <p>联系地址：<span style={spanLineStyle}></span></p>
                            <p>联系电话:<span style={spanLineStyle}></span></p>
                        </div>
                        <div>
                            <p>承租人（乙方）签章: <span style={{ width: "150px", display: "inline-block", fontSize: "20px", borderBottom: "2px solid black" }}>{contractInfo.realName}</span></p>
                            <p>证件名称及编号：<span style={spanLineStyle}></span></p>
                            <p>委托代理人：<span style={spanLineStyle}></span></p>
                            <p>联系地址：<span style={spanLineStyle}></span></p>
                            <p>联系电话:<span style={spanLineStyle}></span></p>
                        </div>
                        <img alt='stamp' src={stamp} style={{
                            width: "200px", height: "200px",
                            position: "absolute",
                            left: '0px',
                            top: '0px',
                        }} />
                    </div>
                </div>
            </div>
        );
    }
}
const spanLineStyle: CSSProperties = {
    display: 'inline-block',
    width: '150px',
    borderBottom: "2px solid black",
};
export default withRouter(HouseContract);

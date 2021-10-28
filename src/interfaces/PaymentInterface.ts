
export enum PayChannel
{
    aliPay = '支付宝',
    wechatPay = '微信支付'
}
export declare interface AliPayOrderState
{
    //联合类型只能访问公共成员,这里需要使用交叉类型
    alipay_trade_query_response: AliPayOrderStateSuccess & AliPayOrderStateFail;
    sign: string; //签名
}
declare interface AlipayTradeQueryResponse
{
    code: string;
    mesg: string;
    buyer_pay_amount: string;
    invoice_amount: string;
    out_trade_no: string;
    point_amount: string;
    receipt_amount: string;
}
declare interface AliPayOrderStateSuccess extends AlipayTradeQueryResponse
{
    buyer_logon_id: string;
    buyer_user_id: string;
    buyer_user_type: string;
    send_pay_date: string;
    total_amount: string;
    trade_no: string;
    trade_status: string;
}
declare interface AliPayOrderStateFail extends AlipayTradeQueryResponse
{
    sub_code: string;
    sub_msg: string;
}

export interface AliPayRefundOrderState
{
    alipay_trade_refund_response: AliPayRefundStateSuccess & AliPayRefundStateFail;
    sign: string;
}
interface AlipayRefundQueryResponse
{
    code: string;
    msg: string;
    refund_fee: string;     //退款金额
    send_back_fee: string;
}
interface AliPayRefundStateSuccess extends AlipayRefundQueryResponse
{
    buyer_logon_id: string;
    buyer_user_id: string;
    fund_change: string;
    gmt_refund_pay: string;
    out_trade_no: string;
    trade_no: string;
}
interface AliPayRefundStateFail extends AlipayRefundQueryResponse
{
    sub_code: string;
    sub_msg: string;
}

//订单状态
export enum OrderState
{
    wating = '等待中',
    error = '异常',
    close = '关闭',
    processing = '进行中',
}

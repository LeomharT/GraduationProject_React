import moment, { Moment } from "moment";
import { generateUUID } from "three/src/math/MathUtils";
import Order from "./Order";

export default class OrderRefund extends Order
{
    constructor(refundDate: Moment)
    {
        super(refundDate);
        this._RefundOrderId = moment(Date.now()).format("YYYYMMDDhhmmss") + generateUUID().toString().split('-')[0];
    }
    private _RefundOrderId: string;
    refundAmount: string;
    tradeNo: string;
}

import { observable } from "mobx";
import moment, { Moment } from "moment";
import { generateUUID } from "three/src/math/MathUtils";
import Order from "./Order";

export default class OrderRenewal extends Order
{
    constructor(renewalDate: Moment)
    {
        super(renewalDate);
        this.newOrderId = moment(Date.now()).format("YYYYMMDDhhmmss") + generateUUID().toString().split('-')[0];
    }
    @observable newOrderId: string;
}

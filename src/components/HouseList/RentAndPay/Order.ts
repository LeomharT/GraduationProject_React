import { observable } from "mobx";
import moment, { Moment } from "moment";
import { generateUUID } from "three/src/math/MathUtils";
import { HouseBaseInfo } from "../../../interfaces/HouseListInterface";
import { PayChannel } from "../../../interfaces/PaymentInterface";
import { TenantInfo } from "../../../interfaces/UserInferface";

export default class Order
{
    constructor()
    {
        this.checkOutDate.add(1, 'M');
        this.orderId = moment(Date.now()).format("YYYYMMDDhhmmss") + generateUUID().toString().split('-')[0];
    }
    orderId: string;
    @observable checkInDate: Moment = moment(Date.now());
    @observable checkOutDate: Moment = moment(this.checkInDate);
    @observable checkInMonth: number = 1;
    @observable tenantNum: number = 1;
    tenantInfo: TenantInfo;
    finalRent: number;
    payChannel: string = PayChannel.aliPay;
    housebaseInfo: HouseBaseInfo;
    SetCheckIn = (checkInDate: Moment) =>
    {
        this.checkInDate = checkInDate;
        this.SetCheckout(this.checkInMonth);
    };
    SetCheckout = (month: number) =>
    {
        this.checkInMonth = month;
        this.checkOutDate = moment(this.checkInDate);
        this.checkOutDate.add(this.checkInMonth, 'M');
    };
}

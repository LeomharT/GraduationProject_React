import { observable } from "mobx";
import moment, { Moment } from "moment";
import { HouseBaseInfo } from "../../../interfaces/HouseListInterface";
import { PayChannel } from "../../../interfaces/PaymentInterface";
import { TenantInfo } from "../../../interfaces/UserInferface";

export default class Order
{
    constructor(checkInDate: Moment)
    {
        this.checkInDate = checkInDate;
        this.checkOutDate = moment(checkInDate);
        this.checkOutDate.add(1, 'M');
    }
    @observable checkInDate: Moment;
    @observable checkOutDate: Moment;
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

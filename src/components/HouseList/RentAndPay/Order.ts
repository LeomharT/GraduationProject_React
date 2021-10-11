import { observable } from "mobx";
import moment, { Moment } from "moment";

export default class Order
{
    constructor()
    {
        this.checkOutDate.add(1, 'M');
    }
    @observable checkInDate: Moment = moment(Date.now());
    @observable checkOutDate: Moment = moment(this.checkInDate);
    @observable checkInMonth: number = 1;
    SetCheckIn = (checkIn: Moment) =>
    {
        this.checkInDate = checkIn;
        this.SetCheckout(this.checkInMonth);
    };
    SetCheckout = (month: number) =>
    {
        this.checkInMonth = month;
        this.checkOutDate = moment(this.checkInDate);
        this.checkOutDate.add(this.checkInMonth, 'M');
    };
}

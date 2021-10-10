import moment, { Moment } from "moment";

export default class Order
{
    checkInDate: Moment = moment(Date.now());
    checkOutDate: Moment = moment(this.checkInDate);
    checkInMonth: number = 1;
}

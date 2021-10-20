import { Moment } from "moment";
import Order from "./Order";

export default class OrderReserve extends Order
{
    constructor(checkInDate: Moment)
    {
        super(checkInDate);
    }
}

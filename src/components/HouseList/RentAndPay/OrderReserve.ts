import moment, { Moment } from "moment";
import { generateUUID } from "three/src/math/MathUtils";
import Order from "./Order";

export default class OrderReserve extends Order
{
    constructor(checkInDate: Moment)
    {
        super(checkInDate);
        this.orderId = moment(Date.now()).format("YYYYMMDDhhmmss") + generateUUID().toString().split('-')[0];
    }
    private orderId: string;
}

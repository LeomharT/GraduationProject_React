import { Moment } from "moment";
import Order from "./Order";

export default class OrderRenewal extends Order
{
    constructor(renewalDate: Moment)
    {
        super(renewalDate);
    }
}

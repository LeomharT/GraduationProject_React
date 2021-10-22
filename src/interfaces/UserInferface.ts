export interface RegionType
{
    T_region_ID: string;
    T_region_CODE: string;
    T_region_NAME: string;
    PARENT_ID: string;
    T_region_LEVEL: string;
    T_region_ORDER: string;
    T_region_NAME_EN: string;
    T_region_SHORTNAME_EN: string;
}
export declare interface TenantInfo
{
    tenant_name: string;
    contry: string;
    id_type: string;
    tenant_num: string;
}
export declare interface UserRentListItem
{
    uId: string,
    hId: string,
    orderId: string,
    buyer_user_id: string,
    totalAmount: string,
    sendPayDate: Date,
    trade_no: string,
    checkInDate: Date,
    checkOutDate: Date,
}

export declare interface HouseParams
{
    params_id: string,
    params_name: string,
    params_label: string,
    params_enums: Array<string>;
};
export declare interface HouseBaseInfo
{
    hId: string,
    hTitle: string,
    hRegion: string,
    hMethod: string,
    hRent: string,
    hLayout: string,
    hTowards: string,
    hFloor: string,
    hElevator: string,
    hFeature: string,
    hExhibitImg: string,
    hTags: string,
    isVRed: boolean,
}
export declare interface HouseDetailInfo
{
    baseInfo: HouseBaseInfo;
    carousel: HouseCarousel[];

}
export declare interface HouseCarousel
{
    id: string,
    hId: string,
    url: string;
}

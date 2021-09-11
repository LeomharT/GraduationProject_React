export declare interface HouseExhibitList
{
    count: number;
    HouseList: HouseBaseInfo[];
}
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
    [index: string]: any;
    hId: string;
    uId: string;
    Area: string;
    Maintain: Date;
    Parking: string;
    Electricity: string;
    Warm: string;
    Water: string;
    isAirCondition: boolean;
    isBed: boolean;
    isCloset: boolean;
    isGas: boolean;
    isHeating: boolean;
    isLaundryMachine: boolean;
    isRefrigerator: boolean;
    isTelevision: boolean;
    isWaterHeater: boolean;
    isWIFI: boolean;
    hLatitude: string,
    hLongitude: string;
}
export declare interface HouseInfo
{
    baseInfo: HouseBaseInfo;
    carousel: HouseCarousel[];
    detailInfo: HouseDetailInfo;
}
export declare interface HouseCarousel
{
    id: string,
    hId: string,
    url: string;
}
export declare interface HouseVRInfo
{
    hId: string,
    positions: Array<HouseVRPosition>,
    sceneId: string,
    sceneName: string,
    urls: Array<{ imgId: string, url: string; }>;
}
export declare interface HouseVRPosition
{
    x: string,
    y: string,
    z: string,
    toSceneId: string,
    toSceneName: string;
}

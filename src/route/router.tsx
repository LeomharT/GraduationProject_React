import CArticle from "../components/Community/CAriticle";
import Community from "../components/Community/Community";
import Home from "../components/Home/Home";
import MapSearch from "../components/Home/MapSearch";
import HouseDetail from "../components/HouseList/HouseDetailInfo";
import HouseExhibit from "../components/HouseList/HouseExhibit";
import HouseList from "../components/HouseList/HouseList";
import User from "../components/User/User";
import U_EditUserInfo from "../components/User/U_EditUserInfo";
import U_UserCollect from "../components/User/U_UserCollect";
import U_UserRents from "../components/User/U_UserRents";
import VRScene from "../components/VR/VRScene";

export interface RouteType
{
    title: string;
    path: string;
    childRoute?: RouteType[];
    components: React.ComponentType<any>;
}

const route: RouteType[] = [
    { title: 'Home', path: "/Home", components: Home },
    {
        title: 'HouseList', path: "/HouseList", components: HouseList, childRoute: [
            { title: "HouseExhibit", path: "/HouseList/Exhibits/:hRegion?", components: HouseExhibit },
            { title: "HouseExhibit", path: "/HouseList/DetailInfo/:HouseId", components: HouseDetail },
        ]
    },
    {
        title: 'User', path: "/User", components: User, childRoute: [
            { title: "EditUserInfo", path: '/User/EditUserInfo', components: U_EditUserInfo },
            { title: "UserCollection", path: '/User/UserCollection', components: U_UserCollect },
            { title: "UserRents", path: '/User/UserRents', components: U_UserRents },
        ]
    },
    { title: "VRScene", path: "/VRScene/:HouseId", components: VRScene },
    { title: "MapSearch", path: "/MapSearch", components: MapSearch },
    { title: "Community", path: '/Community', components: Community },
    { title: "CArticle", path: '/CArticle', components: CArticle },
];


export default route;

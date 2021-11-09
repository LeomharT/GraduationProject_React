import ArticleContent from "../components/Community/ArticleContent";
import ArticleList from "../components/Community/ArticleList";
import Community from "../components/Community/Community";
import Editer from "../components/Community/Editer";
import Home from "../components/Home/Home";
import MapSearch from "../components/Home/MapSearch";
import HouseDetail from "../components/HouseList/HouseDetailInfo";
import HouseExhibit from "../components/HouseList/HouseExhibit";
import HouseList from "../components/HouseList/HouseList";
import ConfirmOrder from "../components/HouseList/RentAndPay/ConfirmOrder";
import PaymentSuccess from "../components/HouseList/RentAndPay/PaymentSuccess";
import RefundOrder from "../components/HouseList/RentAndPay/RefundOrder";
import HouseRepair from "../components/HouseList/Repair/HouseRepair";
import Journey from "../components/Journey/Journey";
import JourneyDetail from "../components/Journey/JourneyDetail";
import U_UserCollect from "../components/Journey/U_UserCollect";
import User from "../components/User/User";
import U_UserRents from "../components/User/UserRent/U_UserRents";
import U_ArticleManage from "../components/User/U_ArticleManage";
import U_EditUserInfo from "../components/User/U_EditUserInfo";
import U_RepairOrder from "../components/User/U_RepairOrder";
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
            { title: "ConfirmOrder", path: "/HouseList/ConfirmOrder/:hId", components: ConfirmOrder },
            { title: "RefundOrder", path: "/HouseList/RefundOrder", components: RefundOrder },
            { title: "HouseRepair", path: "/HouseList/HouseRepair", components: HouseRepair },
        ]
    },
    {
        title: 'User', path: "/User", components: User, childRoute: [
            { title: "EditUserInfo", path: '/User/EditUserInfo', components: U_EditUserInfo },
            { title: "UserRents", path: '/User/UserRents', components: U_UserRents },
            { title: "ArticleManage", path: '/User/ArticleManage', components: U_ArticleManage },
            { title: "ArticleManage", path: '/User/RepairOrder', components: U_RepairOrder },
        ]
    },
    { title: "VRScene", path: "/VRScene/:HouseId", components: VRScene },
    { title: "MapSearch", path: "/MapSearch", components: MapSearch },
    {
        title: "Community", path: '/Community', components: Community, childRoute: [
            { title: "Community", path: "/Community", components: ArticleList },
            { title: "PostArtcle", path: "/Community/PostArtcle", components: Editer },
            { title: "ArticleContent", path: "/Community/ArticleContent/:id", components: ArticleContent },
        ]
    },
    { title: "PaymentSuccess", path: "/PaymentSuccess", components: PaymentSuccess },
    { title: "UserCollection", path: '/UserCollection', components: U_UserCollect },
    { title: "Journey", path: '/Journey', components: Journey },
    { title: "JourneyDetail", path: '/JourneyDetail', components: JourneyDetail },
];


export default route;

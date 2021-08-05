import Home from "../components/Home/Home";
import HouseList from "../components/HouseList/HouseList";
import User from "../components/User/User";
import U_EditUserInfo from "../components/User/U_EditUserInfo";
import U_UserCollect from "../components/User/U_UserCollect";
import U_UserRents from "../components/User/U_UserRents";

export interface RouteType
{
    title: string;
    path: string;
    childRoute?: RouteType[];
    components: React.ComponentType;
}

const route: RouteType[] = [
    { title: 'Home', path: "/Home", components: Home },
    { title: 'HouseList', path: "/HouseList", components: HouseList },
    {
        title: 'User', path: "/User", components: User, childRoute: [
            { title: "EditUserInfo", path: '/User/EditUserInfo', components: U_EditUserInfo },
            { title: "UserCollection", path: '/User/UserCollection', components: U_UserCollect },
            { title: "UserRents", path: '/User/UserRents', components: U_UserRents },
        ]
    },
];


export default route;

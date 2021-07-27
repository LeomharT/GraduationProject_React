import Home from "../components/Home/Home";
import HouseList from "../components/HouseList/HouseList";
import User from "../components/User/User";

export interface RouteType
{
    title: string;
    path: string;
    components: React.ComponentType;
}

const route: RouteType[] = [
    { title: 'Home', path: "/Home", components: Home },
    { title: 'HouseList', path: "/HouseList", components: HouseList },
    { title: 'User', path: "/User", components: User },
];


export default route;

import Home from "../components/Home/Home";
import HouseList from "../components/HouseList/HouseList";

export interface RouteType
{
    title: string;
    path: string;
    components: React.ComponentType;
}

const route: RouteType[] = [
    { title: 'Home', path: "/Home", components: Home },
    { title: 'HouseList', path: "/HouseList", components: HouseList },
];


export default route;

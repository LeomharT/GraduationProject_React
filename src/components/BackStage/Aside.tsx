import { CommentOutlined, FormOutlined } from '@ant-design/icons';
import { Menu } from "antd";
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { AppIconTitle } from '../Common/AppIconTitle';
import { IsAsideFoldedSelector } from './redux/Global/Global_Selectro';
export default function Aside()
{
    const isFolded = useSelector(IsAsideFoldedSelector);
    const history = useHistory();
    const SelectMenuIndex = (): Array<string> =>
    {
        const { pathname } = history.location;
        const curr = pathname.slice(pathname.lastIndexOf('/') + 1);
        switch (curr)
        {
            case 'AdminConsult':
                return ['1'];
            case 'HouseMaintain':
                return ['2'];
            case 'RepairManage':
                return ['3'];
            default:
                return ['1'];
        }
    };
    return (
        <Menu
            inlineCollapsed={isFolded}
            theme='dark'
            className='Aside'
            defaultSelectedKeys={SelectMenuIndex()}
            defaultOpenKeys={['sub1']}
            mode="inline"
        >
            <AppIconTitle title={isFolded ? '' : '优区生活'} />
            <Menu.Item key="1" icon={<CommentOutlined />}>
                <Link to='/BackStage/AdminConsult'>在线咨询</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<FormOutlined />}>
                <Link to='/BackStage/HouseMaintain'>房源维护</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<FormOutlined />}>
                <Link to='/BackStage/RepairManage'>报修订单</Link>
            </Menu.Item>
        </Menu>
    );
}

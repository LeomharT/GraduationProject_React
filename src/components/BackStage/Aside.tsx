import { CommentOutlined } from '@ant-design/icons';
import { Menu } from "antd";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppIconTitle } from '../Common/AppIconTitle';
import { IsAsideFoldedSelector } from './redux/Global/Global_Selectro';
export default function Aside()
{
    const isFolded = useSelector(IsAsideFoldedSelector);
    return (
        <Menu
            inlineCollapsed={isFolded}
            theme='dark'
            className='Aside'
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
        >
            <AppIconTitle title={isFolded ? '' : '优区生活'} />
            <Menu.Item key="1" icon={<CommentOutlined />}>
                <Link to='/BackStage/AdminConsult'>在线咨询</Link>
            </Menu.Item>
        </Menu>
    );
}

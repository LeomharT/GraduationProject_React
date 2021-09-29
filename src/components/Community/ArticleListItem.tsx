import LikeOutlined from '@ant-design/icons/lib/icons/LikeOutlined';
import MessageOutlined from '@ant-design/icons/lib/icons/MessageOutlined';
import { Avatar, List, Space } from 'antd';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component, FunctionComponent, MouseEventHandler } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { ArticleItem } from '../../interfaces/CommunityInterface';
const IconText = (props: { icon: FunctionComponent, text: string, onClick?: MouseEventHandler; }) => (
    <Space
        onClick={props?.onClick}>
        {React.createElement(props.icon)}
        {props.text}
    </Space>
);
declare interface CListItemProps extends RouteComponentProps
{
    data: ArticleItem;
}
@observer
class ArticleListItem extends Component<CListItemProps, {}>
{
    render()
    {
        const { data } = this.props;
        moment.defineLocale('zh-cn', {
            relativeTime: {
                future: '%s内',
                past: '%s前',
                s: '几秒',
                m: '1 分钟',
                mm: '%d 分钟',
                h: '1 小时',
                hh: '%d 小时',
                d: '1 天',
                dd: '%d 天',
                M: '1 个月',
                MM: '%d 个月',
                y: '1 年',
                yy: '%d 年',
            },
        });
        return (
            <List.Item
                key={this.props.data.id}
                actions={[
                    <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                    <IconText icon={MessageOutlined} text="2" key="list-vertical-message"
                        onClick={() =>
                        {
                            this.props.history.push('/CArticle');
                        }}
                    />,
                ]}
                extra={
                    <img
                        width={272}
                        alt="logo"
                        src={data.advertimg}
                    />
                }>
                <List.Item.Meta
                    avatar={<Avatar src={data.avatar} />}
                    title={<span onClick={() => { this.props.history.push('/CArticle'); }}>{data.user}</span>}
                    description={moment(data.postdate).fromNow()}
                />
                {this.props.data.title}
            </List.Item>
        );
    }
}
export default withRouter(ArticleListItem);

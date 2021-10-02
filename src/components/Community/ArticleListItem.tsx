import LikeOutlined from '@ant-design/icons/lib/icons/LikeOutlined';
import MessageOutlined from '@ant-design/icons/lib/icons/MessageOutlined';
import { Avatar, List, Space, Tooltip } from 'antd';
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

        return (
            <List.Item
                key={this.props.data.id}
                actions={[
                    <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                    <IconText icon={MessageOutlined} text="2" key="list-vertical-message"
                        onClick={() =>
                        {
                            this.props.history.push(`/Community/ArticleContent/${data.id}`);
                        }} />,
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
                    title={<span>{data.user}</span>}
                    description={
                        <Tooltip title={moment(data.postdate).format('YYYY-MM-DD hh:mm:ss')}>
                            {moment(data.postdate).fromNow()}
                        </Tooltip>
                    }
                />
                {this.props.data.title}
            </List.Item>
        );
    }
}
export default withRouter(ArticleListItem);

import LikeOutlined from '@ant-design/icons/lib/icons/LikeOutlined';
import MessageOutlined from '@ant-design/icons/lib/icons/MessageOutlined';
import StarOutlined from '@ant-design/icons/lib/icons/StarOutlined';
import { Avatar, List, Space } from 'antd';
import { observer } from 'mobx-react';
import React, { Component, FunctionComponent } from 'react';
const IconText = (props: { icon: FunctionComponent, text: string; }) => (
    <Space>
        {React.createElement(props.icon)}
        {props.text}
    </Space>
);
@observer
export default class CListItem extends Component<{ data: any; }, {}>
{
    render()
    {
        return (
            <List.Item
                key={Symbol().toString()}
                actions={[
                    <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                    <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                    <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                ]}
                extra={
                    <img
                        width={272}
                        alt="logo"
                        src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                }>

                <List.Item.Meta
                    avatar={<Avatar src='https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png' />}
                    title='ueserName'
                    description='asdasdjoasi'
                />
                {this.props.data.content}
            </List.Item>
        );
    }
}

import { AudioOutlined, CloseOutlined, CommentOutlined, SendOutlined, SmileOutlined, WechatOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Input, Popover } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import '../../assets/scss/HConsult.scss';
import { EmojiType } from '../../interfaces/HomeInterface';
import UserStore from '../../redux/UserStore';
import EmojiList from './EmojiList';

@observer
export default class HConsult extends Component<{}, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable emojiList: EmojiType[] = [];
    @observable messageInput = React.createRef<Input>();
    InitSocketIo = () =>
    {
        const { socketIo } = this.UserStore;
        socketIo.on('connect', () =>
        {

        });
    };
    componentDidMount()
    {
        this.InitSocketIo();
    }
    render()
    {
        const { UserStore } = this;
        return (
            <div className='HConsultWrapper'>
                <Popover
                    visible={UserStore.showChat}
                    autoAdjustOverflow={true}
                    placement='topRight'
                    content={
                        <Card
                            className='HConsult'
                            bordered={false}
                            title={
                                <>
                                    <WechatOutlined style={{ color: 'rgb(57, 106, 255)' }} />
                                    &nbsp;&nbsp;在线咨询
                                </>
                            }>
                            <div className='Consulting'>
                            </div>
                            <Divider style={{ margin: "0" }} />
                            <div className='MessageInput'>
                                {/* 文本框 */}
                                <Input
                                    ref={this.messageInput}
                                    size='large'
                                    bordered={false}
                                    placeholder="撰写消息"
                                    style={{ width: "230px" }}
                                />
                                {/* 发送文本消息 */}
                                <Button
                                    icon={<SendOutlined />}
                                    type='text'
                                    onClick={() =>
                                    {
                                        console.log(this.messageInput.current!.clearableInput.props.value);
                                        this.messageInput.current!.setValue("");
                                    }}
                                />
                                {/* Emoji */}
                                <Popover
                                    trigger='click'
                                    placement='topRight'
                                    content={<EmojiList messageInput={this.messageInput} />}
                                >
                                    <Button icon={<SmileOutlined />} type='text' />
                                </Popover>
                                {/* 语音转文本 */}
                                <Button icon={<CommentOutlined />} type='text' />
                                {/* 语音 */}
                                <Button icon={<AudioOutlined />} type='text' />
                            </div>
                        </Card>
                    }>
                    <Button
                        className='OpenChat'
                        size='large'
                        shape='circle'
                        type='primary'
                        onClick={() =>
                        {
                            UserStore.showChat = !UserStore.showChat;
                        }}
                        icon={
                            !UserStore.showChat
                                ? <WechatOutlined id='chatOn' />
                                : <CloseOutlined id='chatOff' />
                        }
                    />
                </Popover>
            </div>

        );
    }
}

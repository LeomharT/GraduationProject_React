import { AudioOutlined, CloseOutlined, CommentOutlined, SendOutlined, SmileOutlined, WechatOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Popover } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import '../../assets/scss/HConsult.scss';
import UserStore from '../../redux/UserStore';
import EmojiList from './EmojiList';
import VoiceMessage from './VoiceMessage';
import VoiceTranslate from './VoiceTranslate';
export enum MessageType
{
    System = "系统消息",
    MyMessage = "我的消息",
    OtherMessage = '其他消息'
}

@observer
export default class HConsult extends Component<{}, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable messageInput = React.createRef<HTMLInputElement>();
    messageDisplayArea = React.createRef<HTMLUListElement>();
    voiceMessage = React.createRef<HTMLAudioElement>();
    InitSocketIo = () =>
    {
        const { socketIo } = this.UserStore;
        socketIo.on('connect', () =>
        {
            console.log(socketIo.id);
        });
        socketIo.on("receive-message", (message) =>
        {
            this.DisplayMessage(message, MessageType.OtherMessage);
        });
        socketIo.on("receive-voicemessage", (message) =>
        {
            let blob = new Blob([message], { type: "audio/webm;codecs=opus" });
            let url = window.URL.createObjectURL(blob);
            this.DisPlayVoiceMessage(url, MessageType.OtherMessage);
        });
    };
    DisplayMessage = (message: string, type: MessageType) =>
    {
        const { messageDisplayArea } = this;
        let li = document.createElement("li");
        if (type === MessageType.MyMessage)
        {
            li.classList.add("MyMessage");
        } if (type === MessageType.OtherMessage)
        {
            li.classList.add("OtherMessage");
        }
        li.innerText = message;
        messageDisplayArea.current!.appendChild(li);
        let scroll = document.getElementsByClassName("Consulting")[0] as HTMLDivElement;
        scroll.scrollTop = scroll.scrollHeight;
    };
    DisPlayVoiceMessage = (url: string, type: MessageType) =>
    {
        const li = document.createElement("li");
        li.classList.add("VoiceIcon");
        switch (type)
        {
            case MessageType.MyMessage: {
                li.classList.add('MyMessage');
                break;
            }
            case MessageType.OtherMessage: {
                li.classList.add("OtherMessage");
                break;
            }
            default: break;
        }
        li.setAttribute("data-url", url);
        li.addEventListener('click', (e: MouseEvent) =>
        {
            this.voiceMessage.current!.src = li.getAttribute("data-url") as string;
            this.voiceMessage.current!.play();
        });
        this.messageDisplayArea.current!.appendChild(li);
    };
    SocketSendStringMessage = (message: string) =>
    {
        const { socketIo } = this.UserStore;
        socketIo.send(message);
        this.DisplayMessage(message, MessageType.MyMessage);
    };
    SocketSendVoiceMessage = (message: Blob) =>
    {
        const { socketIo } = this.UserStore;
        socketIo.emit("voice-message", message);
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
                                {/* 播放音频的标签 */}
                                <audio ref={this.voiceMessage} />
                                {/* 聊天内容显示界面 */}
                                <ul ref={this.messageDisplayArea}>
                                    <Divider
                                        className='SystemMessage'
                                        type='horizontal'
                                        plain
                                    >{moment(new Date(Date.now())).format('hh:mm')}
                                    </Divider>
                                </ul>
                            </div>
                            <Divider style={{ margin: "0" }} />
                            <div className='MessageInput'>
                                {/* 文本框 */}
                                <input
                                    ref={this.messageInput}
                                    placeholder="撰写消息"
                                    onKeyDown={(e: React.KeyboardEvent) =>
                                    {
                                        e.stopPropagation();
                                        if (e.key === 'Enter')
                                        {
                                            if (!this.messageInput.current!.value) return;
                                            this.SocketSendStringMessage(this.messageInput.current!.value);
                                            this.messageInput.current!.value = "";
                                        }
                                    }} />
                                {/* 发送文本消息 */}
                                <Button
                                    icon={<SendOutlined />}
                                    type='text'
                                    onClick={() =>
                                    {
                                        if (!this.messageInput.current!.value) return;
                                        this.SocketSendStringMessage(this.messageInput.current!.value);
                                        this.messageInput.current!.value = "";
                                    }} />
                                {/* Emoji */}
                                <Popover
                                    trigger='click'
                                    placement='topRight'
                                    content={<EmojiList messageInput={this.messageInput} />}
                                ><Button icon={<SmileOutlined />} type='text' />
                                </Popover>
                                {/* 语音转文本 */}
                                <Popover
                                    trigger='click'
                                    placement='top'
                                    content={<VoiceTranslate messageInput={this.messageInput} />}
                                ><Button icon={<CommentOutlined />} type='text' />
                                </Popover>
                                {/* 语音 */}
                                <Popover
                                    trigger='click'
                                    placement='top'
                                    content={
                                        <VoiceMessage
                                            SocketSendVoiceMessage={this.SocketSendVoiceMessage}
                                            DisPlayVoiceMessage={this.DisPlayVoiceMessage} />
                                    }
                                ><Button icon={<AudioOutlined />} type='text' />
                                </Popover>
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

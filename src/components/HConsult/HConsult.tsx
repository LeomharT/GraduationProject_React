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

        });
    };
    DisplayMessage = () =>
    {

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
                                    <li className='YourMessage'>
                                        我说了一句话我说了很长😄的语句话周末办呢来弟弟
                                        我说了一句话我说了很长的语句话周末办呢来弟弟
                                        我说了一句话我说了很长的语句话周末办呢来弟弟
                                    </li>
                                    <li className='OtherMessage'>
                                        我说了一句话我说了很长的语句话周末办呢来弟弟
                                        我说了一句话我说了很长的语句话周末办呢来弟弟
                                        说了一句话我说了很长的语句话周末办呢来弟弟
                                    </li>
                                </ul>
                            </div>
                            <Divider style={{ margin: "0" }} />
                            <div className='MessageInput'>
                                {/* 文本框 */}
                                <input
                                    ref={this.messageInput}
                                    placeholder="撰写消息" />
                                {/* 发送文本消息 */}
                                <Button
                                    icon={<SendOutlined />}
                                    type='text'
                                    onClick={() =>
                                    {
                                        if (!this.messageInput.current!.value) return;
                                        console.log(this.messageInput.current!.value);
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
                                        <VoiceMessage voiceMessage={this.voiceMessage} />
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

import { AudioOutlined, CloseOutlined, CommentOutlined, SendOutlined, SmileOutlined, WechatOutlined } from '@ant-design/icons';
import { TagOutlined } from '@ant-design/icons/lib/icons';
import { Button, Card, Divider, Popover, Tag, Tooltip } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import '../../assets/scss/HConsult.scss';
import { HouseInfo } from '../../interfaces/HouseListInterface';
import SocketStore from '../../redux/SocketStore';
import UserStore from '../../redux/UserStore';
import { CONST_HOST } from '../Common/VariableGlobal';
import EmojiList from './EmojiList';
import VoiceMessage from './VoiceMessage';
import VoiceTranslate from './VoiceTranslate';
export enum MessageType
{
    System = "系统消息",
    MyMessage = "MyMessage",
    OtherMessage = 'OtherMessage'
}
declare interface HConsultProps extends RouteComponentProps
{

}

@observer
class HConsult extends Component<HConsultProps, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    SocketStore: SocketStore = SocketStore.GetInstance();
    @observable messageInput = React.createRef<HTMLInputElement>();
    messageDisplayArea = React.createRef<HTMLUListElement>();
    voiceMessage = React.createRef<HTMLAudioElement>();
    @observable currentHouseInfo: HouseInfo | undefined;
    @observable tagVisible: boolean = true;
    adminRoomId: string | undefined = undefined;
    InitSocketIo = () =>
    {
        const { socketIo } = this.SocketStore;
        socketIo.on('connect', () =>
        {
            console.log(socketIo.id);
        });
        socketIo.on("receive-message", (message) =>
        {
            this.UserStore.showChat = true;
            this.DisplayMessage(message, MessageType.OtherMessage);
        });
        socketIo.on("receive-voicemessage", (message) =>
        {
            let blob = new Blob([message], { type: "audio/webm;codecs=opus" });
            let url = window.URL.createObjectURL(blob);
            this.UserStore.showChat = true;
            this.DisPlayVoiceMessage(url, MessageType.OtherMessage);
        });
        socketIo.on("receive-housemessage", (hId) =>
        {
            this.UserStore.showChat = true;
            this.DisPlayHouseMessage(hId, MessageType.OtherMessage);
        });
        socketIo.on('receive-adminroom', (room) =>
        {
            console.log("AdminRoomId:" + room);
            if (room)
            {
                this.adminRoomId = room;
            }
        });
        //如果连不上就算了
        setTimeout(() =>
        {
            if (!socketIo.connected)
            {
                socketIo.disconnect();
            }
        }, 3000);
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
        messageDisplayArea.current?.appendChild(li);
        this.ScrollToButtom();
    };
    DisPlayVoiceMessage = (url: string, type: MessageType) =>
    {
        const { messageDisplayArea } = this;
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
        messageDisplayArea.current?.appendChild(li);
        this.ScrollToButtom();
    };
    DisPlayHouseMessage = async (hId: string, type: MessageType) =>
    {
        let res = await (
            await
                fetch(`${CONST_HOST}/GetHouseDetailInfo?hId=${hId}`)
        ).json() as HouseInfo;
        const { messageDisplayArea } = this;
        const li = document.createElement("li");
        li.classList.add(type, 'HouseMessage');
        const img = new Image();
        img.alt = 'cover';
        img.src = `${CONST_HOST}/${res.baseInfo.hExhibitImg}`;
        const div = document.createElement('div');
        let p1 = document.createElement("p"); p1.textContent = `${res.baseInfo.hMethod}·${res.baseInfo.hTitle}`;
        let p2 = document.createElement("p"); p2.textContent = `${res.baseInfo.hLayout}/${res.detailInfo.Area}/${res.baseInfo.hTowards}`;
        let p3 = document.createElement("p"); p3.textContent = `￥${res.baseInfo.hRent}元/月`;
        div.appendChild(p1); div.appendChild(p2); div.appendChild(p3);
        li.appendChild(img);
        li.appendChild(div);
        li.addEventListener("click", () =>
        {
            //😄我先用路由去销毁然后再跳转过去,巧妙!
            this.props.history.push(`/HouseList/Exhibits`);
            this.props.history.push(`/HouseList/DetailInfo/${hId}`);
        });
        messageDisplayArea.current?.appendChild(li);

        /**
         * 添加Dom节点的第二种方法--但是不知道如何绑定方法😵
         */
        // messageDisplayArea.current!.insertAdjacentHTML('beforeend',
        //     `<li class="${type} HouseMessage">
        //         <img alt='cover' src=${CONST_HOST + '/' + res.baseInfo.hExhibitImg} />
        //         <div>
        //             <p>${res.baseInfo.hMethod}·
        //             ${res.baseInfo.hTitle}</p>
        //             <p>${res.baseInfo.hLayout}/
        //             ${res.detailInfo.Area}/
        //             ${res.baseInfo.hTowards}</p>
        //             <p>&yen;${res?.baseInfo.hRent}元/月</p>
        //         </div>
        //     </li>`
        // );
        this.ScrollToButtom();
    };
    SocketSendVoiceMessage = (message: Blob) =>
    {
        const { socketIo } = this.SocketStore;
        socketIo.emit("voice-message", message);
    };
    SocketSendHouseMessage = async (hId: string) =>
    {
        const { socketIo } = this.SocketStore;
        socketIo.emit("house-message", hId);
        await this.DisPlayHouseMessage(hId, MessageType.MyMessage);
    };
    GetHouseInfo = async () =>
    {
        const { pathname } = this.props.history.location;
        if (!pathname.includes("/DetailInfo"))
        {
            this.currentHouseInfo = undefined;
            return;
        };
        let hId = pathname.substring(pathname.lastIndexOf("/") + 1);
        let res = await (
            await
                fetch(`${CONST_HOST}/GetHouseDetailInfo?hId=${hId}`)
        ).json();
        this.currentHouseInfo = res;
    };
    ScrollToButtom = () =>
    {
        let scroll = document.getElementsByClassName("Consulting")[0] as HTMLDivElement;
        if (scroll)
            scroll.scrollTop = scroll.scrollHeight;
    };
    async componentDidMount()
    {
        this.InitSocketIo();
        await this.GetHouseInfo();
    }
    render()
    {
        if (this.props.history.location.pathname.includes("VRScene") || this.props.history.location.pathname.includes("BackStage"))
            return (null);
        const { UserStore } = this;
        const RenderHouseInfoTag = () =>
        {
            const { currentHouseInfo } = this;
            if (!this.currentHouseInfo) return null;
            return (
                <div className='HInfoTag'>
                    {!this.tagVisible &&
                        <Tooltip title='显示当前房屋'>
                            <Button
                                icon={<TagOutlined />}
                                size='small'
                                type='link'
                                onClick={() =>
                                {
                                    this.tagVisible = true;
                                }}
                            />
                        </Tooltip>
                    }
                    {
                        currentHouseInfo?.baseInfo
                            ? <Tag
                                closable
                                visible={this.tagVisible}
                                onClose={() =>
                                {
                                    this.tagVisible = false;
                                }}
                            >
                                <div className='TagContent'>
                                    <img alt='cover' src={`${CONST_HOST}/${currentHouseInfo?.baseInfo.hExhibitImg}`} />
                                    <div>
                                        <p>{`${currentHouseInfo?.baseInfo.hMethod}·
                                    ${currentHouseInfo?.baseInfo.hTitle}`}</p>
                                        <p>{`${currentHouseInfo?.baseInfo.hLayout}/
                                    ${currentHouseInfo?.detailInfo.Area}/
                                    ${currentHouseInfo?.baseInfo.hTowards}`}</p>
                                        <p>&yen;{currentHouseInfo?.baseInfo.hRent}元/月</p>
                                    </div>
                                    <Button
                                        type='primary'
                                        size='small'
                                        onClick={async () =>
                                        {
                                            this.SocketSendHouseMessage(currentHouseInfo?.baseInfo.hId as string);
                                            this.tagVisible = false;
                                        }}
                                    >发给客服</Button>
                                </div>
                            </Tag>
                            : null
                    }

                </div>
            );
        };
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
                            {RenderHouseInfoTag()}
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
                                            this.SocketStore.SocketSendStringMessage(
                                                this.messageInput.current!.value,
                                                this.adminRoomId,
                                                this.SocketStore.socketIo.id,
                                                this.DisplayMessage,
                                            );
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
                                        this.SocketStore.SocketSendStringMessage(
                                            this.messageInput.current!.value,
                                            this.adminRoomId,
                                            this.SocketStore.socketIo.id,
                                            this.DisplayMessage,
                                        );
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
                        onClick={async () =>
                        {
                            UserStore.showChat = !UserStore.showChat;
                            await this.GetHouseInfo();
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
export default withRouter(HConsult);

import { SearchOutlined, SendOutlined, SmileOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Divider, Empty, Input, message, Popover } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HouseInfo } from '../../../interfaces/HouseListInterface';
import SocketStore from '../../../redux/SocketStore';
import UserStore from '../../../redux/UserStore';
import { CONST_HOST } from '../../Common/VariableGlobal';
import EmojiList from '../../HConsult/EmojiList';
import { MessageType } from '../../HConsult/HConsult';

interface SocketMessage
{
    //这就是TS设置动态字段的方法啊
    [index: string]: Messages[];
}
interface Messages
{
    socketId: string;
    message: string;
}
export default function AdminConsult()
{
    //还有一个初始值，填入初始值才能获取到RefObject啊🐂。
    const messageInput = useRef<HTMLInputElement>(null);
    const voiceMessage = useRef<HTMLAudioElement>(null);
    const messageDisplayArea = useRef<HTMLUListElement>(null);
    const socketStore: SocketStore = SocketStore.GetInstance();
    const userStore: UserStore = UserStore.GetInstance();
    const [messageStore, setmessageStore] = useState<SocketMessage>({} as SocketMessage);
    const [currUser, setcurrUser] = useState<string>('');
    const InitSocketIo = useCallback(() =>
    {
        const { socketIo } = socketStore;
        socketIo.on('connect', () =>
        {
            console.log(socketIo.id);
            socketStore.socketIo.emit("sendAdminRoom", socketStore.socketIo.id);
        });
        socketIo.on("receive-message", (message, socketId) =>
        {
            setmessageStore((messageStore) =>
            {
                if (messageStore[socketId])
                {
                    messageStore[socketId].push({ socketId, message });
                } else
                {
                    messageStore[socketId] = [{ socketId, message }];
                }
                return { ...messageStore };
            });
            if (currUser === '')
                setcurrUser(Object.keys(messageStore)[0]);
            // DisplayMessage(message, MessageType.OtherMessage);
        });
        socketIo.on("receive-voicemessage", (message) =>
        {
            let blob = new Blob([message], { type: "audio/webm;codecs=opus" });
            let url = window.URL.createObjectURL(blob);
            DisPlayVoiceMessage(url, MessageType.OtherMessage);
        });
        socketIo.on("receive-housemessage", (hId) =>
        {
            DisPlayHouseMessage(hId, MessageType.OtherMessage);
        });
        //如果连不上就算了
        setTimeout(() =>
        {
            if (!socketIo.connected)
            {
                socketIo.disconnect();
            }
        }, 3000);
    }, [socketStore, userStore]);
    const DisPlayVoiceMessage = (url: string, type: MessageType) =>
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
            voiceMessage.current!.src = li.getAttribute("data-url") as string;
            voiceMessage.current!.play();
        });
        messageDisplayArea.current?.appendChild(li);
        ScrollToButtom();
    };
    const DisPlayHouseMessage = async (hId: string, type: MessageType) =>
    {
        let res = await (
            await
                fetch(`${CONST_HOST}/GetHouseDetailInfo?hId=${hId}`)
        ).json() as HouseInfo;
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
            window.open(`/HouseList/DetailInfo/${hId}`);
        });
        messageDisplayArea.current?.appendChild(li);
        ScrollToButtom();
    };
    const ScrollToButtom = () =>
    {
        let scroll = document.getElementsByClassName("ContentArea")[0] as HTMLDivElement;
        if (scroll)
            scroll.scrollTop = scroll.scrollHeight;
    };
    useEffect(() =>
    {
        InitSocketIo();
    }, [InitSocketIo]);
    return (
        <div className='AdminConsult'>
            <div className='ConsultSide'>
                <div className='ConsultSearch'>
                    <Input bordered={false} prefix={<SearchOutlined />} placeholder='搜索用户' />
                </div>
                <div className='ConsultUserList'>
                    {
                        Object.keys(messageStore).length
                            ? Object.keys(messageStore).map((key: string) =>
                            {
                                return (
                                    <div key={key} className='SwitchUserConsult'
                                        onClick={() =>
                                        {
                                            setcurrUser(key);
                                        }}
                                    >
                                        <Badge color='green'>
                                            <Avatar style={{ background: "white" }} size='large' src={`https://joeschmoe.io/api/v1/random${key}`} />
                                        </Badge>
                                        <div style={{ userSelect: "none" }}>
                                            {key.substr(0, 5)}
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            {moment(Date.now()).format("hh:mm")}
                                            <Badge size='small' count={1} />
                                        </div>
                                    </div>
                                );
                            })
                            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="暂无咨询" />
                    }
                </div>
            </div>
            <div className='ConsultContent'>
                <div className='ContentArea'>
                    <audio ref={voiceMessage} />
                    {/* 聊天内容显示界面 */}
                    <ul ref={messageDisplayArea}>
                        <Divider
                            className='SystemMessage'
                            type='horizontal'
                            plain
                        >{moment(new Date(Date.now())).format('hh:mm')}
                        </Divider>
                        {
                            Object.keys(messageStore).length && currUser !== ''
                                ? messageStore[currUser].map((v: Messages, index: number) =>
                                {
                                    if (v.socketId === socketStore.socketIo.id)
                                    {
                                        return (
                                            <li key={Date.now() + index} className='MyMessage'>
                                                {v.message}
                                            </li>
                                        );
                                    } else
                                    {
                                        return (
                                            <li key={Date.now() + index} className='OtherMessage'>
                                                {v.message}
                                            </li>
                                        );
                                    }
                                })
                                : null
                        }
                    </ul>
                </div>
                <div className='InputArea'>
                    <Popover
                        trigger='click'
                        placement='topLeft'
                        content={<EmojiList messageInput={messageInput} />}
                    ><Button icon={<SmileOutlined />} size='large' type='text' />
                    </Popover>
                    <input ref={messageInput} placeholder="撰写消息" onKeyDown={(e: React.KeyboardEvent) =>
                    {
                        e.stopPropagation();
                        if (e.key === 'Enter')
                        {
                            if (!messageInput.current!.value) return;
                            if (currUser === '')
                            {
                                message.error("没有选择用户");
                                return;
                            }
                            socketStore.SocketSendStringMessage(
                                messageInput.current!.value,
                            );
                            let messages = { ...messageStore };
                            messages[currUser].push({
                                socketId: socketStore.socketIo.id,
                                message: messageInput.current!.value,
                            });
                            setmessageStore(messages);
                            messageInput.current!.value = "";
                        }
                    }} />
                    <Button icon={<SendOutlined />} size='large' type='link' onClick={() =>
                    {
                        if (!messageInput.current!.value) return;
                        if (currUser === '')
                        {
                            message.error("没有选择用户");
                            return;
                        }
                        socketStore.SocketSendStringMessage(
                            messageInput.current!.value,
                        );
                        let messages = { ...messageStore };
                        messages[currUser].push({
                            socketId: socketStore.socketIo.id,
                            message: messageInput.current!.value,
                        });
                        setmessageStore(messages);
                        messageInput.current!.value = "";
                    }} />
                </div>
            </div>
        </div>
    );
}

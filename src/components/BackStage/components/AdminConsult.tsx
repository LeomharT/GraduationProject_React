import { SearchOutlined, SendOutlined, SmileOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Divider, Empty, Input, message, Popover } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HouseInfo } from '../../../interfaces/HouseListInterface';
import SocketStore from '../../../redux/SocketStore';
import { CONST_HOST } from '../../Common/VariableGlobal';
import EmojiList from '../../HConsult/EmojiList';
import { MessageType } from '../../HConsult/HConsult';

interface SocketMessage
{
    //这就是TS设置动态字段的方法啊
    [index: string]: JSX.Element[];
}
interface Messages
{
    messageEl: HTMLLIElement;
}
export default function AdminConsult()
{
    //还有一个初始值，填入初始值才能获取到RefObject啊🐂。
    const messageInput = useRef<HTMLInputElement>(null);
    const voiceMessage = useRef<HTMLAudioElement>(null);
    const messageDisplayArea = useRef<HTMLUListElement>(null);
    const socketStore: SocketStore = SocketStore.GetInstance();
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
            setmessageStore((prveMessageStore: SocketMessage) =>
            {
                let temp = { ...prveMessageStore };
                if (temp[socketId])
                {
                    temp[socketId] = temp[socketId].concat(DisplayMessage(message, MessageType.OtherMessage));
                } else
                {
                    temp[socketId] = [DisplayMessage(message, MessageType.OtherMessage)];
                }
                //与setState不同,必须手动合并不然会出现多次添加???
                return (
                    Object.assign({ ...prveMessageStore }, { ...temp })
                );
            });
            setcurrUser((currUser) =>
            {
                if (currUser === '')
                {
                    return socketId;
                } else
                {
                    return currUser;
                }

            });
        });
        socketIo.on("receive-voicemessage", (message, socketId) =>
        {
            let blob = new Blob([message], { type: "audio/webm;codecs=opus" });
            let url = window.URL.createObjectURL(blob);
            setmessageStore((prveMessageStore: SocketMessage) =>
            {
                let temp = { ...prveMessageStore };
                if (temp[socketId])
                {
                    temp[socketId] = temp[socketId].concat(DisPlayVoiceMessage(url, MessageType.OtherMessage));
                } else
                {
                    temp[socketId] = [DisplayMessage(url, MessageType.OtherMessage)];
                }
                return (
                    Object.assign({ ...prveMessageStore }, { ...temp })
                );
            });
            setcurrUser((currUser) =>
            {
                if (currUser === '')
                {
                    return socketId;
                } else
                {
                    return currUser;
                }
            });
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
    }, [socketStore]);
    const DisplayMessage = (message: string, type: MessageType) =>
    {
        const li = (
            <li className={type} key={new Date().toLocaleString('chinese', { hour12: false })}>
                {message}
            </li>
        );
        return (li);
    };
    const DisPlayVoiceMessage = (url: string, type: MessageType) =>
    {
        const li = (
            <li className={`VoiceIcon ${type}`}
                key={new Date().toLocaleString('chinese', { hour12: false })}
                data-url={url}
                onClick={(e: React.MouseEvent) =>
                {
                    const el = e.target as HTMLLinkElement;
                    voiceMessage.current!.src = el.getAttribute("data-url") as string;
                    voiceMessage.current!.play();
                }}
            >
            </li>
        );
        return li;
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
                                ? messageStore[currUser].map((LiEl: JSX.Element, index: number) =>
                                {
                                    return (LiEl);
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
                                currUser,
                                socketStore.socketIo.id,
                            );
                            let messages = { ...messageStore };
                            messages[currUser].push(
                                DisplayMessage(
                                    messageInput.current!.value,
                                    MessageType.MyMessage,
                                )
                            );
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
                            currUser,
                            socketStore.socketIo.id,
                        );
                        let messages = { ...messageStore };
                        messages[currUser].push(
                            DisplayMessage(
                                messageInput.current!.value,
                                MessageType.MyMessage,
                            )
                        );
                        setmessageStore(messages);
                        messageInput.current!.value = "";
                    }} />
                </div>
            </div>
        </div>
    );
}

import { SearchOutlined, SendOutlined, SmileOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Popover } from 'antd';
import moment from 'moment';
import React, { useRef } from 'react';
import SocketStore from '../../../redux/SocketStore';
import UserStore from '../../../redux/UserStore';
import EmojiList from '../../HConsult/EmojiList';
import { MessageType } from '../../HConsult/HConsult';

export default function AdminConsult()
{
    //还有一个初始值，填入初始值才能获取到RefObject啊🐂。
    const messageInput = useRef<HTMLInputElement>(null);
    const voiceMessage = useRef<HTMLAudioElement>(null);
    const messageDisplayArea = useRef<HTMLUListElement>(null);
    const socketStore: SocketStore = SocketStore.GetInstance();
    const userStore: UserStore = UserStore.GetInstance();
    const InitSocketIo = () =>
    {

        const { socketIo } = socketStore;
        socketIo.on('connect', () =>
        {
            console.log(socketIo.id);
        });
        socketIo.on("receive-message", (message) =>
        {
            userStore.showChat = true;
            DisplayMessage(message, MessageType.OtherMessage);
        });
        socketIo.on("receive-housemessage", (hId) =>
        {
            userStore.showChat = true;
            // DisPlayHouseMessage(hId, MessageType.OtherMessage);
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
    const DisplayMessage = (message: string, type: MessageType) =>
    {
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
        // this.ScrollToButtom();
    };
    InitSocketIo();
    return (
        <div className='AdminConsult'>
            <div className='ConsultSide'>
                <div className='ConsultSearch'>
                    <Input bordered={false} prefix={<SearchOutlined />} placeholder='搜索用户' />
                </div>
                <div className='ConsultUserList'>

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
                    </ul>
                </div>
                <div className='InputArea'>
                    <Popover
                        trigger='click'
                        placement='topLeft'
                        content={<EmojiList messageInput={messageInput} />}
                    ><Button icon={<SmileOutlined />} size='large' type='text' />
                    </Popover>
                    <input ref={messageInput} placeholder="撰写消息" />
                    <Button icon={<SendOutlined />} size='large' type='link' onClick={() =>
                    {
                        socketStore.SocketSendStringMessage(messageInput.current!.value, DisplayMessage);
                        messageInput.current!.value = "";
                    }} />
                </div>
            </div>
        </div>
    );
}

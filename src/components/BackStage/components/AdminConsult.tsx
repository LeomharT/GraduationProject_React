import { SearchOutlined, SendOutlined, SmileOutlined } from '@ant-design/icons';
import { Button, Input, Popover } from 'antd';
import React, { useRef } from 'react';
import EmojiList from '../../HConsult/EmojiList';

export default function AdminConsult()
{
    //还有一个初始值，填入初始值才能获取到RefObject啊🐂。
    const messageInput = useRef<HTMLInputElement>(null);
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

                </div>
                <div className='InputArea'>
                    <Popover
                        trigger='click'
                        placement='topLeft'
                        content={<EmojiList messageInput={messageInput} />}
                    ><Button icon={<SmileOutlined />} size='large' type='text' />
                    </Popover>
                    <input ref={messageInput} placeholder="撰写消息" />
                    <Button icon={<SendOutlined />} size='large' type='link' />
                </div>
            </div>
        </div>
    );
}

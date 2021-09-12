import { AudioOutlined, CloseOutlined, CommentOutlined, SendOutlined, SmileOutlined, WechatOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Input, Pagination, Popover } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { getEmojiList } from '../../assets/js/emoji-list-with-image';
import '../../assets/scss/HConsult.scss';
import { EmojiType } from '../../interfaces/HomeInterface';
import UserStore from '../../redux/UserStore';

@observer
export default class HConsult extends Component<{}, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable showChat: boolean = true;
    @observable emojiList: EmojiType[] = [];
    InitSocketIo = () =>
    {
        const { socketIo } = this.UserStore;
        socketIo.on('connect', () =>
        {

        });
    };
    InitEmojiList = (page: number = 1) =>
    {
        this.emojiList = [];
        getEmojiList()[page - 1].forEach((emoji, index) =>
        {
            let unicode = emoji[1];
            let img_src = `data:image/png;base64,` + emoji[2];
            let _emoji = {} as EmojiType;
            _emoji['unicode'] = unicode;
            _emoji['src'] = img_src;
            this.emojiList.push(_emoji);
        });
        console.log(this.emojiList);
    };
    /**
     * @description 对Unicode转码
     */
    FindSurrogatePair = (code: any) =>
    {
        let offset = code - 0x10000,
            lead = 0xd800 + (offset >> 10),
            trail = 0xdc00 + (offset & 0x3ff);
        return [lead.toString(16), trail.toString(16)];
    };
    componentDidMount()
    {
        this.InitSocketIo();
        this.InitEmojiList();
    }
    render()
    {
        const { emojiList } = this;

        const RenderEmojis = (): JSX.Element =>
        {
            return (<ul>
                {emojiList.map((emoji, index) =>
                {
                    return (
                        <li key={index}>
                            <img alt='emoji' src={emoji.src} />
                        </li>
                    );
                })}
            </ul>);
        };

        return (
            <div className='HConsultWrapper'>
                <Popover
                    visible={this.showChat}
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
                                <Input
                                    size='large'
                                    // bordered={false}
                                    placeholder="撰写消息"
                                    style={{ width: "230px" }}
                                />
                                {/* 发送文本消息 */}
                                <Button icon={<SendOutlined />} type='text' />
                                {/* Emoji */}
                                <Popover
                                    trigger='click'
                                    placement='topRight'
                                    content={
                                        <div className='EmojiList'>
                                            {RenderEmojis()}
                                            <Pagination
                                                size='small'
                                                total={50}
                                                onChange={(page) =>
                                                {
                                                    this.InitEmojiList(page);
                                                }}
                                            />
                                        </div>
                                    }
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
                            this.showChat = !this.showChat;
                        }}
                        icon={
                            !this.showChat
                                ? <WechatOutlined />
                                : <CloseOutlined />
                        }
                    />
                </Popover>
            </div>

        );
    }
}

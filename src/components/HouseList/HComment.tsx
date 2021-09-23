import { CommentOutlined, DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined, PictureOutlined, SmileOutlined } from '@ant-design/icons';
import { Avatar, Button, Comment, Divider, Popover, Tooltip } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component, createElement, RefObject } from 'react';
import UserStore from '../../redux/UserStore';
import EmojiList from '../HConsult/EmojiList';
@observer
export default class HComment extends Component<{}, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    messageTextArea: RefObject<HTMLTextAreaElement> = React.createRef<HTMLTextAreaElement>();
    fileUploader: RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>();
    render()
    {
        return (
            <div className='HComment' id='HComment'>
                <input
                    type='file'
                    style={{ display: "none" }}
                    ref={this.fileUploader}
                    onChange={() =>
                    {

                    }} />
                <div className='CommentInput'>
                    <Avatar
                        size={46}
                        shape='circle'
                        src={
                            this.UserStore.authInfo.userInfo
                                ? this.UserStore.authInfo.userInfo.photo
                                : 'https://files.authing.co/authing-console/default-user-avatar.png'
                        }
                    />
                    <div>
                        <textarea ref={this.messageTextArea} rows={4} />
                        <div>
                            <Popover
                                trigger='click'
                                content={
                                    <EmojiList messageInput={this.messageTextArea} />
                                }
                            >
                                <Button
                                    type='link'
                                    icon={<SmileOutlined />}
                                />
                            </Popover>
                            <Button
                                type='link'
                                icon={<PictureOutlined />}
                                onClick={() =>
                                {
                                    this.fileUploader.current!.click();
                                }}
                            />
                        </div>
                        <Button
                            type='primary'
                            icon={<CommentOutlined />}
                            style={{ width: "200px" }}
                            onClick={() =>
                            {
                                this.UserStore.CheckForIsLogin();
                            }}
                        >
                            发布评论
                        </Button>
                    </div>
                </div>
                <Divider />
                <CommentItem />
            </div>
        );
    }
}
@observer
export class CommentItem extends React.Component<{}, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable likes: number = 0;
    @observable dislikes: number = 0;
    @observable liked: string = "";
    render()
    {
        const actions = [
            <Tooltip title='赞'>
                <span onClick={() =>
                {
                    this.liked = 'like';
                    this.likes = 1;
                    this.dislikes = 0;
                }}>
                    {createElement(this.liked === 'like' ? LikeFilled : LikeOutlined)}
                    <span style={{ paddingLeft: "5px" }}>{this.likes}</span>
                </span>
            </Tooltip>,
            <Tooltip title='踩'>
                <span onClick={() =>
                {
                    this.liked = 'dislike';
                    this.likes = 0;
                    this.dislikes = 1;
                }}>
                    {createElement(this.liked === 'dislike' ? DislikeFilled : DislikeOutlined)}
                    <span style={{ paddingLeft: "5px" }}>{this.dislikes}</span>
                </span>
            </Tooltip>,
            <span>回复</span>,
        ];
        return (
            <Comment
                actions={actions}
                author={<span>Han Solo</span>}
                avatar={
                    <Avatar
                        size={46}
                        shape='circle'
                        src={
                            this.UserStore.authInfo.userInfo
                                ? this.UserStore.authInfo.userInfo.photo
                                : 'https://files.authing.co/authing-console/default-user-avatar.png'
                        }
                    />
                }
                content={
                    <p>
                        We supply a series of design principles, practical patterns and high quality design
                        resources (Sketch and Axure), to help people create their product prototypes beautifully
                        and efficiently.
                    </p>
                }
                datetime={
                    <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{moment().fromNow()}</span>
                    </Tooltip>
                }
            />
        );
    }
}

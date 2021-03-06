import { CloseSquareOutlined, CommentOutlined, DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined, PictureOutlined, SmileOutlined } from '@ant-design/icons';
import { Avatar, Button, Comment, Divider, Empty, Image, message, Popover, Tooltip } from 'antd';
import { User } from 'authing-js-sdk';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component, createElement, RefObject } from 'react';
import { HouseComment, HouseInfo } from '../../interfaces/HouseListInterface';
import UserStore from '../../redux/UserStore';
import { CommentLoader } from '../Common/Content_Loader';
import { CONST_HOST } from '../Common/VariableGlobal';
import EmojiList from '../HConsult/EmojiList';
@observer
export default class HComment extends Component<{ houseDetailInfo: HouseInfo; }, {}>
{
    @observable commentList: HouseComment[] = [];
    @observable loading: boolean = false;
    InitComment = async (parentId: string = '0'): Promise<void> =>
    {
        this.loading = true;
        this.commentList = await (
            (await fetch(`${CONST_HOST}/GetHouseComment?hId=${this.props.houseDetailInfo.baseInfo.hId}&parentId=${parentId}`)).json()
        ) as HouseComment[];
        this.loading = false;
    };
    async componentDidMount()
    {
        await this.InitComment();
    }
    render()
    {
        return (
            <div className='HComment' id='HComment'>
                <CommentInput
                    hId={this.props.houseDetailInfo.baseInfo.hId}
                    callBack={this.InitComment}
                    url='/PostHouseComment' />
                <Divider />
                {this.loading && <CommentLoader />}
                {this.commentList.length === 0 && !this.loading && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无评论' />}
                {
                    this.commentList.map((c: HouseComment) =>
                    {
                        return (
                            <CommentItem key={c.id} commentItem={c} url='/GetHouseComment' postUrl='/PostHouseComment' />
                        );
                    })
                }
            </div>
        );
    }
}

declare interface CommentInputProps
{
    hId: string,
    commentId?: string,
    callBack: Function;
    url: string;
}
@observer
export class CommentInput extends React.Component<CommentInputProps, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    messageTextArea: RefObject<HTMLTextAreaElement> = React.createRef<HTMLTextAreaElement>();
    fileUploader: RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>();
    @observable imgArray: string[] = [];
    PostImg = (e: React.ChangeEvent<HTMLInputElement>): void =>
    {
        if (!e.target.files) return;
        if (e.target.files[0].size > 1000000)
        {
            message.error("图片太大了哦小老弟🤨");
            return;
        };
        if (this.imgArray.length >= 3)
        {
            message.error("太多图片了哦🤨,干掉一点去😀");
            return;
        }
        const fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = (e) =>
        {
            this.imgArray.push(e.target?.result?.toString() as string);
        };
        e.target.value = '';
    };
    PostComment = async (parentId: number): Promise<void> =>
    {
        if (this.messageTextArea.current!.value === '' && this.imgArray.length === 0) return;
        let formData = new FormData();
        formData.set("hId", this.props.hId);
        formData.set('uId', this.UserStore.GetCurrentUserId());
        formData.set('content', this.messageTextArea.current!.value);
        this.imgArray.forEach((v: string) =>
        {
            formData.append('images', v.toString());
        });
        formData.set('parentId', parentId.toString());
        formData.set('commentDate', new Date().toLocaleString('chinese', { hour12: false }));
        let res = await (await fetch(`${CONST_HOST}${this.props.url}`, {
            method: "POST",
            body: formData
        })).json();
        if (res.affectedRows === 1)
        {
            message.success("发布成功");
            this.messageTextArea.current!.value = '';
            this.imgArray = [];
            this.props.callBack();
        } else
        {
            message.error("发布失败");
        }
    };
    render()
    {
        return (
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
                            placement='bottomLeft'
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
                    <div className='PostImgs'>
                        {this.imgArray.map((url: string, index: number) =>
                        {
                            return (
                                <div key={index}>
                                    <Button
                                        danger
                                        icon={<CloseSquareOutlined />}
                                        size='middle'
                                        type='link'
                                        onClick={() =>
                                        {
                                            this.imgArray.splice(index, 1);
                                        }}
                                    />
                                    <img alt='图片' src={url} />
                                </div>
                            );
                        })}
                        {Boolean(this.imgArray.length) && <span>
                            {`(${this.imgArray.length}/3)`}
                        </span>}
                    </div>
                    <Button
                        type='primary'
                        icon={<CommentOutlined />}
                        style={{ width: "200px" }}
                        onClick={async () =>
                        {
                            if (this.UserStore.CheckForIsLogin())
                            {
                                const parentId = this.props.commentId ?? "0";
                                await this.PostComment(parseInt(parentId));
                            }
                        }}
                    >发布评论
                    </Button>
                </div>
                <input
                    type='file'
                    style={{ display: "none" }}
                    ref={this.fileUploader}
                    onChange={this.PostImg} />
            </div>
        );
    }
}

declare interface CommentItemProps
{
    commentItem: HouseComment;
    url: string;
    postUrl: string;
}
@observer
export class CommentItem extends React.Component<CommentItemProps, {}>
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable likes: number = 0;
    @observable dislikes: number = 0;
    @observable liked: string = "";
    @observable showReplay: boolean = false;
    @observable replays: HouseComment[] = [];
    @observable commentUser: User;
    InitReplay = async () =>
    {
        const { commentItem } = this.props;
        this.replays = await (
            (await fetch(`${CONST_HOST}${this.props.url}?hId=${commentItem.hId}&parentId=${commentItem.id}`)).json()
        ) as HouseComment[];
    };
    InitCommentUser = async (): Promise<void> =>
    {
        this.commentUser = await this.UserStore.managementClient.users.detail(
            this.props.commentItem.uId
        );
    };
    async componentDidMount()
    {
        await this.InitReplay();
        await this.InitCommentUser();
    }
    render()
    {
        const { commentItem } = this.props;
        const { commentUser } = this;
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
            <span
                style={{
                    color: !this.showReplay ? 'rgba(0, 0, 0, 0.45)' : '#1890ff',
                }}
                onClick={() =>
                {
                    this.showReplay = !this.showReplay;
                }}
            >回复
            </span>,
        ];
        const RenderCommentImg = () =>
        {
            const { images } = commentItem;
            if (images !== 'null')
            {
                return images.split("-lzy-");
            } else
            {
                return null;
            }
        };
        if (!commentUser) return null;
        return (
            <div className='CommentItem'>
                <Comment
                    actions={actions}
                    author={<span>{commentUser.username}</span>}
                    avatar={
                        <Avatar
                            size={46}
                            shape='circle'
                            src={commentUser.photo}
                        />
                    }
                    content={
                        <div className='CommentContent'>
                            <p>{commentItem.content}</p>
                            <Image.PreviewGroup>
                                {RenderCommentImg()?.map((i, index) =>
                                {
                                    return (
                                        <Image src={i} key={index} alt={index.toString()} />
                                    );
                                })}
                            </Image.PreviewGroup>
                        </div>}
                    datetime={
                        <Tooltip title={moment(commentItem.commentDate).format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment(commentItem.commentDate).fromNow()}</span>
                        </Tooltip>
                    }
                    children={
                        <>
                            {this.showReplay &&
                                <CommentInput
                                    hId={this.props.commentItem.hId}
                                    commentId={commentItem.id}
                                    callBack={this.InitReplay}
                                    url={this.props.postUrl} />
                            }
                            {this.replays.map((c: HouseComment) =>
                            {
                                return (
                                    <CommentItem
                                        key={c.id}
                                        commentItem={c}
                                        url='/GetHouseComment'
                                        postUrl='/PostHouseComment' />
                                );
                            })}
                        </>
                    }
                />
            </div>
        );
    }
}

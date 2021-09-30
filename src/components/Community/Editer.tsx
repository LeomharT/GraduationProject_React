import { PictureOutlined } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import * as H from 'history';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component, RefObject } from 'react';
import { Prompt, RouteComponentProps, withRouter } from 'react-router-dom';
import E from 'wangeditor';
import UserStore from '../../redux/UserStore';
import { CONST_HOST } from '../Common/VariableGlobal';
declare type ResImgItemType = string | {
    url: string;
    alt?: string;
    href?: string;
};
@observer
class Editer extends Component<RouteComponentProps, {}> {
    UserStore: UserStore = UserStore.GetInstance();
    editer: E;
    advertUploader: RefObject<HTMLInputElement> = React.createRef<HTMLInputElement>();
    title: RefObject<Input> = React.createRef<Input>();
    @observable advertBase64: string = '';
    @observable showConfirm: boolean = true;
    imgResult: ResImgItemType[] = [];
    IninEditer = (): void =>
    {
        this.editer = new E('#CEditer');
        this.editer.config.height = 500;
        this.editer.config.uploadImgServer = `${CONST_HOST}/UploadArticleImg`;
        this.editer.config.uploadImgMaxLength = 5;
        this.editer.config.uploadFileName = 'aimgs';
        this.editer.config.uploadImgHooks = {
            success: (xhr, editor, result) =>
            {
                this.imgResult = this.imgResult.concat(result.data);
            }
        };
        this.editer.create();
    };
    UploadAdvert = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        if (!e.target.files) return;
        if (e.target.files[0].size > 2000000)
        {
            message.error("图片太大了哦小老弟🤨");
            return;
        };
        const fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = (reader) =>
        {
            const img = new Image();
            img.src = reader.target?.result as string;
            img.onload = () =>
            {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                this.advertBase64 = canvas.toDataURL();
            };
        };
        e.target.value = '';
    };
    PostArticle = async () =>
    {
        if (!Boolean(this.title.current!.state.value) || this.editer.txt.html() === '' || this.advertBase64 === '')
        {
            message.error("请检查[题图][标题]和[正文]是否为空");
            return;
        }
        const data = new FormData();
        data.set('avatar', this.UserStore.authInfo?.userInfo?.photo ?? "https://files.authing.co/authing-console/default-user-avatar.png");
        data.set('postdate', moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"));
        data.set('uId', this.UserStore.authInfo?.userInfo?.id);
        data.set('user', this.UserStore.RenderUserName().toString());
        data.set('title', this.title.current!.state.value);
        data.set('adverting', this.advertBase64);
        data.set('content', this.editer.txt.html() as string);
        data.set('lilked', '0');
        data.set('comment', '0');
        let res = await (await fetch(`${CONST_HOST}/PostArticle`, {
            method: "POST",
            body: data
        })).json();
        if (res.affectedRows === 1)
        {
            this.showConfirm = false;
            message.success("发布成功");
            setTimeout(() =>
            {
                this.props.history.push("/Community");
            }, 2000);
        } else
        {
            message.error("发布失败");
        }
    };
    BeforeQuit = (location: H.Location, action: H.Action): string | boolean =>
    {
        if (window.confirm("离开将不会保存"))
        {
            if (this.imgResult.length !== 0)
            {
                let data = new FormData();
                data.append('imgResult', JSON.stringify(this.imgResult));
                fetch(`${CONST_HOST}/DeleteUploadeImgs`, {
                    method: "POST",
                    body: data
                });
            }
            return true;
        } else
        {
            return false;
        }
    };
    componentDidMount()
    {
        this.IninEditer();
    }
    componentWillUnmount()
    {
        this.editer.destroy();
    }
    render()
    {
        return (
            <div className='PostAriticle'>
                <Prompt
                    when={this.showConfirm}
                    message={this.BeforeQuit}
                />
                <div className='AddAdvertImg'
                    onClick={() => { this.advertUploader.current!.click(); }}
                >
                    {this.advertBase64 && <img alt='advert' src={this.advertBase64} />}

                    <input type='file' ref={this.advertUploader}
                        onChange={this.UploadAdvert}
                    />
                    {!this.advertBase64 &&
                        <>
                            <PictureOutlined style={{ fontSize: "64px", color: "rgba(18,18,18,.2)" }} />
                            <p>添加题图</p>
                        </>
                    }
                </div>
                <Input
                    ref={this.title}
                    className='AddTitle'
                    size='large'
                    placeholder='输入文章描述'
                />
                <div className='CEditer' id='CEditer' />
                <Button
                    block
                    size='large'
                    onClick={async () =>
                    {
                        if (this.UserStore.CheckForIsLogin())
                        {
                            await this.PostArticle();
                        }
                    }}>
                    提交
                </Button>
            </div>
        );
    }
}
export default withRouter(Editer);

import { Avatar, Divider } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { Component, RefObject } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { ArticleItem } from '../../interfaces/CommunityInterface';
import { HouseComment } from '../../interfaces/HouseListInterface';
import UserStore from '../../redux/UserStore';
import { CONST_HOST } from '../Common/VariableGlobal';
import { CommentInput, CommentItem } from '../HouseList/HComment';




@observer
class ArticleContent extends Component<RouteComponentProps, {}>
{
    UsetStore: UserStore = UserStore.GetInstance();
    contentRef: RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    @observable articleContent: ArticleItem;
    @observable commentList: HouseComment[] = [];
    @observable loading: boolean = false;
    InitComment = async (hId: string) =>
    {
        this.loading = true;
        this.commentList = await (
            (await fetch(`${CONST_HOST}/GetArticleComment?hId=${hId}&parentId=0`)).json()
        ) as HouseComment[];
        this.loading = false;
    };
    async componentDidMount()
    {
        const { id } = this.props.match.params as { id: string; };
        this.articleContent = (await (
            await fetch(`${CONST_HOST}/GetArticles?id=${id}`)
        ).json())[0];
        this.contentRef.current!.innerHTML = this.articleContent.content;
        await this.InitComment(id);

    }
    render()
    {
        const { articleContent } = this;
        return (
            <div className='ArticleContent'>
                <div className='A_Title'>
                    <div>
                        <Avatar size='large' src={articleContent?.avatar} style={{ marginRight: '10px' }} />
                        <div>
                            <div style={{ fontWeight: "bold", fontSize: "20px" }}>{articleContent?.user}</div>
                            <div>{moment(articleContent?.postdate).format("YYYY年MM月DD日")}</div>
                        </div>
                    </div>
                    <h1 style={{ fontWeight: "bold" }}>
                        {articleContent?.title}
                    </h1>
                </div>
                <div ref={this.contentRef} className='A_Content w-e-text' />
                <Divider />
                <div className='A_Comment'>
                    <CommentInput
                        hId={articleContent?.id}
                        callBack={() => { this.InitComment(articleContent?.id); }}
                        url='/PostArticleComment'
                    />
                    {
                        this.commentList.map((c: HouseComment) =>
                        {
                            return (
                                <CommentItem
                                    key={c.id}
                                    commentItem={c}
                                    url='/GetArticleComment'
                                    postUrl='/PostArticleComment'
                                />
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(ArticleContent);

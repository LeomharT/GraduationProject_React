import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, RefObject } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { ArticleItem } from '../../interfaces/CommunityInterface';
import { CONST_HOST } from '../Common/VariableGlobal';




@observer
class ArticleContent extends Component<RouteComponentProps, {}>
{
    contentRef: RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    @observable articleContent: ArticleItem[] = [];
    async componentDidMount()
    {
        const { id } = this.props.match.params as { id: string; };
        this.articleContent = await (
            await fetch(`${CONST_HOST}/GetArticles?id=${id}`)
        ).json();
        console.log(this.articleContent[0]);
        this.contentRef.current!.innerHTML = this.articleContent[0].content;
    }
    render()
    {
        return (
            <div className='ArticleContent'>
                <div ref={this.contentRef} className='A_Content'>

                </div>
            </div>
        );
    }
}

export default withRouter(ArticleContent);

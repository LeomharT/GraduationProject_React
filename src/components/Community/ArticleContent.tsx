import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, RefObject } from 'react';
import { ArticleItem } from '../../interfaces/CommunityInterface';
import { CONST_HOST } from '../Common/VariableGlobal';

@observer
export default class ArticleContent extends Component<{ article: ArticleItem; }, {}>
{
    contentRef: RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    @observable articles: any[] = [];
    async componentDidMount()
    {
        this.articles = await (await fetch(`${CONST_HOST}/GetArticles`)).json() as ArticleItem[];
        console.log(this.articles);
        this.contentRef.current!.innerHTML = this.articles[1].content;
    }
    render()
    {
        return (
            <div ref={this.contentRef}>

            </div>
        );
    }
}

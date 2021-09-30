import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, RefObject } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';




@observer
class ArticleContent extends Component<RouteComponentProps, {}>
{
    contentRef: RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
    @observable articles: any[] = [];
    async componentDidMount()
    {
        const { aId } = this.props.match.params as any;
        console.log(aId);
    }
    render()
    {
        return (
            <div ref={this.contentRef}>
                aaa
            </div>
        );
    }
}

export default withRouter(ArticleContent);

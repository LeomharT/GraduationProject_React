import { PlusOutlined } from '@ant-design/icons';
import { Button, List, Radio, Spin } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import SaySomething from '../../assets/img/SaySomething.svg';
import '../../assets/scss/Community.scss';
import { ArticleItem } from '../../interfaces/CommunityInterface';
import HeadNavigate from '../Common/HeadNavigate';
import { CONST_HOST } from '../Common/VariableGlobal';
import ArticleListItem from './ArticleListItem';
import CommunityCrowd from './CommunityCrowd';
import Editer from './Editer';

@observer
export default class Community extends Component<{}, {}>
{
    @observable articles: any[] = [];
    @observable loading: boolean = false;
    InitArticles = async (): Promise<void> =>
    {
        this.loading = true;
        this.articles = await (await fetch(`${CONST_HOST}/GetArticles`)).json() as ArticleItem[];
        this.loading = false;
    };
    async componentDidMount()
    {
        await this.InitArticles();
    }
    render()
    {
        return (
            <div className='Community'>
                <HeadNavigate />
                <Switch>
                    <Route path='/Community' exact>
                        <CommunityCrowd />
                        <div className='C_Main'>
                            <div className='StoryTabs'>
                                <Radio.Group
                                    defaultValue='推荐'
                                    buttonStyle='solid'
                                    onChange={(e) =>
                                    {
                                        console.log(e.target.value);
                                    }}>
                                    <Radio.Button value='推荐'>
                                        推荐
                                    </Radio.Button>
                                    <Radio.Button value='最热'>
                                        最热
                                    </Radio.Button>
                                </Radio.Group>
                            </div>
                            <div className='QuestionList'>
                                <Spin size='large' spinning={this.loading}>
                                    <List
                                        itemLayout='vertical'
                                        dataSource={this.articles}
                                        size='large'
                                        renderItem={(item: ArticleItem) =>
                                        {
                                            return (
                                                <ArticleListItem data={item} />
                                            );
                                        }}
                                    >
                                    </List>
                                </Spin>
                                <div className='CreatorEntrance'>
                                    <img alt='saySomething' src={SaySomething} />
                                    <Link to='/Community/PostArtcle'>
                                        <Button block icon={<PlusOutlined />}>
                                            说点什么
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Route>
                    <Route path='/Community/PostArtcle' exact>
                        <Editer />
                    </Route>
                </Switch>
            </div>
        );
    }
}

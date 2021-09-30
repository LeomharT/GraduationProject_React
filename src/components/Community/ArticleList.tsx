import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined';
import { Button, List, Radio, Spin } from 'antd';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SaySomething from '../../assets/img/SaySomething.svg';
import { ArticleItem } from '../../interfaces/CommunityInterface';
import { CONST_HOST } from '../Common/VariableGlobal';
import ArticleListItem from './ArticleListItem';
import CommunityCrowd from './CommunityCrowd';

@observer
export default class ArticleList extends Component
{
    @observable articles: any[] = [];
    @observable loading: boolean = false;

    @action
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
            <>
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
            </>
        );
    }
}

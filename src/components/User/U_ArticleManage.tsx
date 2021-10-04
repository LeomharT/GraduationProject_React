import { DeleteOutlined } from '@ant-design/icons';
import { Button, List, message, Popconfirm, Spin } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { ArticleItem } from '../../interfaces/CommunityInterface';
import UserStore from '../../redux/UserStore';
import { CONST_HOST } from '../Common/VariableGlobal';
import ArticleListItem from '../Community/ArticleListItem';

@observer
export default class U_ArticleManage extends Component
{
    UserStore: UserStore = UserStore.GetInstance();
    @observable articleList: ArticleItem[] = [];
    @observable loading: boolean = false;
    InitUserArticleList = async () =>
    {
        this.loading = true;
        this.articleList = await (
            await fetch(`${CONST_HOST}/GetArticles?uId=${this.UserStore.authInfo.userInfo?.id}`)
        ).json() as ArticleItem[];
        this.loading = false;
    };
    DeleteUserArticle = async (id: string) =>
    {
        let res = await (
            await fetch(`${CONST_HOST}/DeleteArticle?id=${id}`)
        ).json();
        if (res.affectedRows as boolean)
        {
            message.success("删除成功");
        }
        else
        {
            message.error("删除失败");
        }
    };
    async componentDidMount()
    {
        await this.InitUserArticleList();
    }
    render()
    {
        return (
            <div className='U_ArticleManage'>
                <Spin size='large' spinning={this.loading}>
                    <List
                        itemLayout='vertical'
                        dataSource={this.articleList}
                        size='large'
                        renderItem={(item: ArticleItem) =>
                        {
                            return (
                                <div className='U_ListItem'>
                                    <ArticleListItem data={item} />
                                    <Popconfirm
                                        title='您确定删除该文章吗'
                                        onConfirm={async () =>
                                        {
                                            await this.DeleteUserArticle(item.id);
                                            await this.InitUserArticleList();
                                        }}
                                        okText='确定'
                                        cancelText='取消'
                                    >
                                        <Button
                                            danger
                                            type='link'
                                            icon={<DeleteOutlined />}
                                        />
                                    </Popconfirm>
                                </div>
                            );
                        }}>
                    </List>
                </Spin>
            </div>
        );
    }
}

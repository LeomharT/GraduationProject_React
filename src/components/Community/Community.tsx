import { PlusOutlined } from '@ant-design/icons';
import { Button, List, Radio } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import SaySomething from '../../assets/img/SaySomething.svg';
import '../../assets/scss/Community.scss';
import HeadNavigate from '../Common/HeadNavigate';
import CListItem from './CListItem';
import CommunityCrowd from './CommunityCrowd';

@observer
export default class Community extends Component<{}, {}>
{
    @observable articles: any[] = [
        {
            href: 'https://ant.design',
            title: `ant design part 1`,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            description:
                'Ant Design, a design language for background applications, is refined by Ant UED Team.',
            content:
                'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        },
        {
            href: 'https://ant.design',
            title: `ant design part 1`,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            description:
                'Ant Design, a design language for background applications, is refined by Ant UED Team.',
            content:
                'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        },
        {
            href: 'https://ant.design',
            title: `ant design part 1`,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            description:
                'Ant Design, a design language for background applications, is refined by Ant UED Team.',
            content:
                'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        },
        {
            href: 'https://ant.design',
            title: `ant design part 1`,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            description:
                'Ant Design, a design language for background applications, is refined by Ant UED Team.',
            content:
                'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
        }
    ];
    componentDidMount()
    {
    }
    render()
    {
        return (
            <div className='Community'>
                <HeadNavigate />
                <div className='C_Navi'>
                    <CommunityCrowd />
                </div>
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
                        <List
                            itemLayout='vertical'
                            dataSource={this.articles}
                            size='large'
                            renderItem={(item) =>
                            {
                                return (
                                    <CListItem data={item} />
                                );
                            }}

                        >
                        </List>
                        <div className='CreatorEntrance'>
                            <img alt='saySomething' src={SaySomething} />
                            <Button block icon={<PlusOutlined />}>
                                说点什么
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

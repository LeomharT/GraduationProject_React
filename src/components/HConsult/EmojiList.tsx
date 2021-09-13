import { Input, Pagination } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, RefObject } from 'react';
import { getEmojiList } from '../../assets/js/emoji-list-with-image';
import { EmojiType } from '../../interfaces/HomeInterface';

@observer
export default class EmojiList extends Component<{ messageInput: RefObject<Input>; }, {}>
{
    @observable emojiList: EmojiType[] = [];
    InitEmojiList = (page: number = 1) =>
    {
        this.emojiList = [];
        getEmojiList()[page - 1].forEach((emoji, index) =>
        {
            let unicode = emoji[1];
            let img_src = `data:image/png;base64,` + emoji[2];
            let _emoji = {} as EmojiType;
            _emoji['unicode'] = unicode;
            _emoji['src'] = img_src;
            this.emojiList.push(_emoji);
        });
    };
    /**
     * @description 对Unicode转码
     */
    FindSurrogatePair = (code: any) =>
    {
        let offset = code - 0x10000,
            lead = 0xd800 + (offset >> 10),
            trail = 0xdc00 + (offset & 0x3ff);
        return [lead.toString(16), trail.toString(16)];
    };
    TransformUniCodeToEmoji = (uicode: string) =>
    {

    };
    componentDidMount()
    {
        this.InitEmojiList();
    }
    render()
    {
        const { emojiList } = this;
        const RenderEmojis = (): JSX.Element =>
        {
            return (<ul>
                {emojiList.map((emoji, index) =>
                {
                    return (
                        <li
                            key={index}
                            onClick={(e: React.MouseEvent) =>
                            {
                                e.stopPropagation();
                            }}>
                            <img alt='emoji' src={emoji.src} />
                        </li>
                    );
                })}
            </ul>);
        };
        return (
            <div className='EmojiList'>
                {RenderEmojis()}
                <Pagination
                    size='small'
                    total={50}
                    onChange={(page) =>
                    {
                        this.InitEmojiList(page);
                    }}
                />
            </div>
        );
    }
}

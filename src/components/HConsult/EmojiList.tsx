import { Pagination } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, RefObject } from 'react';
import { getEmojiList } from '../../assets/js/emoji-list-with-image';
import { EmojiType } from '../../interfaces/HomeInterface';

@observer
export default class EmojiList extends Component<{ messageInput: RefObject<HTMLInputElement>; }, {}>
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
            _emoji['unicode'] = "0x" + unicode;
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
    TransformUniCodeToEmoji = (unicode: string | string[]) =>
    {
        if (unicode.length < 7)
        {
            //@ts-ignore
            let emojiCode = String.fromCharCode(unicode);
            this.InsertEmojiToCursorPointer(emojiCode);
        } else
        {
            let emojiString: string = '';
            for (let e of this.FindSurrogatePair(unicode))
            {
                emojiString += '\\u';
                emojiString += e;
            }
            this.InsertEmojiToCursorPointer(unescape(emojiString.replace(/\\u/g, '%u')));
        }
    };
    InsertEmojiToCursorPointer = (emoji: string) =>
    {
        let { messageInput } = this.props;
        let startPoint = messageInput.current!.selectionStart;
        let endPoint = messageInput.current!.selectionEnd;
        if (startPoint === undefined || endPoint === undefined) return;
        messageInput.current!.value = messageInput.current!.value.substring(0, startPoint as number)
            + emoji
            + messageInput.current!.value.substring(endPoint as number);
        messageInput.current!.focus();
        messageInput.current!.selectionStart = startPoint as number + emoji.length;
        messageInput.current!.selectionEnd = startPoint as number + emoji.length;
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
                                this.TransformUniCodeToEmoji(emoji.unicode);
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

import { Button } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, RefObject } from 'react';
import { iatRecorder } from '../../assets/js/IatRecorder.js';
@observer
export default class VoiceTranslate extends Component<{ messageInput: RefObject<HTMLInputElement>; }, {}>
{
    button = React.createRef<HTMLElement>();
    @observable isTranslating: boolean = false;
    componentDidMount()
    {
        //@ts-ignore
        iatRecorder.onWillStatusChange = (oldStatus, status) =>
        {
            console.log(iatRecorder);
            let text = {
                null: '开始识别', // 最开始状态
                init: '开始识别', // 初始化状态
                ing: '结束识别', // 正在录音状态
                end: '开始识别', // 结束状态
            };
            //@ts-ignore
            this.button.current!.innerText = text[status];
        };
        //@ts-ignore
        iatRecorder.onTextChange = (text) =>
        {
            console.log(text);
        };
    }
    render()
    {
        return (
            <div className='VoiceTranslate'>
                <Button
                    ref={this.button}
                    size='large'
                    onClick={() =>
                    {
                        this.isTranslating = !this.isTranslating;
                        if (this.isTranslating)
                        {
                            iatRecorder.start();
                        } else
                        {
                            iatRecorder.stop();
                        }
                    }}
                >
                    开始录音
                </Button>
            </div>
        );
    }
}

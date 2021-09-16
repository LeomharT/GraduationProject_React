import { Button } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, RefObject } from 'react';
import { iatRecorder } from '../../assets/js/IatRecorder.js';
@observer
export default class VoiceTranslate extends Component<{ messageInput: RefObject<HTMLInputElement>; }, {}>
{
    constructor(props: { messageInput: RefObject<HTMLInputElement>; })
    {
        super(props);
        //@ts-ignore
        iatRecorder.onWillStatusChange = (oldStatus, status) =>
        {
            console.log(status);
            let text = {
                null: '开始识别', // 最开始状态
                init: '开始识别', // 初始化状态
                ing: '结束识别', // 正在录音状态
                end: '开始识别', // 结束状态
            };
            //@ts-ignore
            this.button.current!.innerText = text[status];
            if (status === 'end') this.isTranslating = false;
        };
        //@ts-ignore
        iatRecorder.onTextChange = (text) =>
        {
            this.props.messageInput.current!.value = text;
        };
    }
    button = React.createRef<HTMLElement>();
    @observable isTranslating: boolean = false;
    render()
    {
        return (
            <div className='VoiceTranslate'>
                {this.isTranslating && <div className='Wave' />}
                <Button
                    ref={this.button}
                    size='large'
                    onClick={() =>
                    {
                        this.isTranslating = !this.isTranslating;
                        if (this.isTranslating)
                        {
                            this.props.messageInput.current!.value = '';
                            iatRecorder.start();
                        } else
                        {
                            iatRecorder.stop();
                        }
                    }}
                >开始识别
                </Button>
            </div>
        );
    }
}

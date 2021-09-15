import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, RefObject } from 'react';

@observer
export default class VoiceMessage extends Component<{ voiceMessage: RefObject<HTMLAudioElement>; }, {}>
{
    @observable recording: boolean = false;
    //@ts-ignore
    @observable mediaRecorder: MediaRecorder;
    GetMicroPhoneAuthority = async (): Promise<void> =>
    {
        const constraints = { audio: true };
        let voice: any[] = [];
        try
        {
            let stream = await navigator.mediaDevices.getUserMedia(constraints);
            //@ts-ignore
            this.mediaRecorder = new MediaRecorder(stream);
            //@ts-ignore
            this.mediaRecorder.ondataavailable = (res) =>
            {
                voice.push(res.data);
            };
            this.mediaRecorder.onstop = () =>
            {
                let blob = new Blob(voice, { type: "audio/webm;codecs=opus" });
                voice = [];
                let url = window.URL.createObjectURL(blob);
                this.props.voiceMessage.current!.src = url;
                this.props.voiceMessage.current!.play();
            };
        } catch (e)
        {
            message.error("请开启麦克风权限!");
        }
    };
    async componentDidMount()
    {
        await this.GetMicroPhoneAuthority();
    }
    render()
    {
        const { recording } = this;
        return (
            <div className='RecordingVoice'>
                {recording && <div className='SoundWave' />}
                {recording && <div className='SoundWaveBorder' />}
                <Button
                    shape='circle'
                    size='large'
                    type='primary'
                    icon={
                        !recording
                            ? <AudioOutlined />
                            : <AudioMutedOutlined />
                    }
                    onClick={() =>
                    {
                        this.recording = !this.recording;
                        if (this.recording)
                        {
                            this.mediaRecorder.start();
                            console.log(this.mediaRecorder.state);
                        } else
                        {
                            this.mediaRecorder.stop();
                            console.log(this.mediaRecorder.state);
                        }
                    }}
                />
            </div>
        );
    }
}

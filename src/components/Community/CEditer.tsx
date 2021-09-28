import { Button } from 'antd';
import React, { Component } from 'react';
import E from 'wangeditor';
export default class CEditer extends Component<{}, {}> {
    editer: E;
    IninEditer = (): void =>
    {
        this.editer = new E('#CEditer');
        this.editer.config.uploadImgShowBase64 = true;
        this.editer.create();
    };
    componentDidMount()
    {
        this.IninEditer();
    }
    render()
    {
        return (
            <div>
                <div className='CEditer' id='CEditer' />
                <Button type='primary' onClick={() =>
                {
                    console.log(this.editer.txt.html());
                }}>
                    提交
                </Button>
            </div>
        );
    }
}

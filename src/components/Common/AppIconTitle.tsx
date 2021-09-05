import { RollbackOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import AppIcon from '../../assets/img/AppIcon.svg';
import '../../assets/scss/Common.scss';


export function AppIconTitle(props: { title?: string; })
{
    return (
        <div className='AppIconTitle'>
            <img src={AppIcon} alt='AppIcon' />
            <span>{props.title}</span>
        </div>
    );
}

export function VRAnimation(props: { left?: string, top?: string, bottom?: string, right?: string; })
{
    return (
        <div
            className='VRAnimation'
            style={{
                left: props.left,
                top: props.top,
                right: props.right,
                bottom: props.bottom
            }}
        >
        </div>
    );
}

export function VerifyIcon(props: {})
{
    return (
        <div className="VerifyIcon">
        </div>
    );
}

export function VRNextSceneArrow(props: {}): JSX.Element
{
    return (
        <div className='VRNextSceneArrow'>
            <div className='VRSceneTagName'>
                厨房
            </div>
        </div>
    );
}

export function Render404(props: {}): JSX.Element
{
    const history = useHistory();
    return (
        <Result
            status='404'
            title="404!未找到该房源"
            subTitle="您寻找的房源编号不存在,请返回列表页."
            extra={
                <Button
                    type='link'
                    icon={<RollbackOutlined />}
                    onClick={() =>
                    {
                        history.push("/HouseList/Exhibits");
                    }}
                >
                    返回租房
                </Button>
            }
        />
    );
}

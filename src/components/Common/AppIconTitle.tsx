import React from 'react';
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
        </div>
    );
}

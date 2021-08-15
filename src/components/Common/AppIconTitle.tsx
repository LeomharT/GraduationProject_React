import React from 'react';
import AppIcon from '../../assets/img/AppIcon.svg';
import '../../assets/scss/Common.scss';

export default function AppIconTitle(props: { title?: string; })
{
    return (
        <div className='AppIconTitle'>
            <img src={AppIcon} alt='AppIcon' />
            <span>{props.title}</span>
        </div>
    );
}

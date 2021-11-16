import { RollbackOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import AppIcon from '../../assets/img/AppIcon.svg';
import '../../assets/scss/Common.scss';
import { OrderState } from '../../interfaces/PaymentInterface';
import { CONST_HOST, LANGUAGE_REFER } from './VariableGlobal';


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

declare interface Render404Props
{
    title: string,
    subTitle: string;
}
export function Render404(props: Render404Props): JSX.Element
{
    const history = useHistory();
    return (
        <Result
            status='404'
            title={props.title}
            subTitle={props.subTitle}
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

export function StateIcon(props: { state: OrderState; }): JSX.Element
{
    switch (props.state)
    {
        case OrderState.wating:
            return (
                <div className='StateIcon'>
                    <span>
                    </span>
                    <div>
                        {props.state}
                    </div>
                </div>
            );
        case OrderState.close:
            return (
                <div className='StateIconClose'>
                    <span>
                    </span>
                    <div>
                        {props.state}
                    </div>
                </div>
            );
        case OrderState.processing:
            return (
                <div className='StateIconProcessing'>
                    <span>
                    </span>
                    <div>
                        {props.state}
                    </div>
                </div>
            );
        case OrderState.error:
            return (
                <div className='StateIconError'>
                    <span>
                    </span>
                    <div>
                        {props.state}
                    </div>
                </div>
            );
        default: return <div>没状态</div>;
    }
}

export function SelfCheckBox(props: { id: string; label: string; color: string; }): JSX.Element
{
    return (
        <div className='SelfCheckBox'>
            {/* 如需使用:checked伪类选择器,那么input必须在前面 */}
            <input type='checkbox' value='1' id={props.id} />
            <label style={{ backgroundColor: props.color }} htmlFor={props.id}>{props.label}</label>
        </div>
    );
}

export function RepairItem(props: {
    id: string,
    value: string,
    type: LANGUAGE_REFER,
    checked?: boolean,
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
}): JSX.Element
{
    const FindKey = (value: LANGUAGE_REFER) =>
    {
        return (
            Object.keys(LANGUAGE_REFER).find((key: string) =>
            {
                return (
                    //@ts-ignore
                    LANGUAGE_REFER[key] === value
                );
            })
        );
    };
    return (
        <div className='RepairItem'>
            <input type='checkbox' checked={props.checked} value={props.value} id={props.id} onChange={props.onChange} />
            <label htmlFor={props.id}>
                <img draggable='false' alt={props.type} src={`${CONST_HOST}/img/HInfoIcons/${FindKey(props.type)}IconNone.jpg`} />
                <img draggable='false' alt={props.type} src={`${CONST_HOST}/img/HInfoIcons/${FindKey(props.type)}Icon.jpg`} />
                {props.type}
            </label>
        </div>
    );
}

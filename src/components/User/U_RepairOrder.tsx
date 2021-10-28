import React, { Component } from 'react';
import { OrderState } from '../../interfaces/PaymentInterface';
import { StateIcon } from '../Common/AppIconTitle';

export default class U_RepairOrder extends Component
{
    render()
    {
        return (
            <div>
                <StateIcon state={OrderState.processing} />
                <StateIcon state={OrderState.wating} />
                <StateIcon state={OrderState.close} />
                <StateIcon state={OrderState.error} />
            </div>
        );
    }
}

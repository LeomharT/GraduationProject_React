import { Action } from 'redux';

export interface ActionProps<T, P> extends Action<T>
{
    payload: P;
}

export enum IsAsideFoldedEnum
{
    Fold = 'Fold',
    UnFold = 'UnFold',
}
export type IsAsideFoldedType = Action<IsAsideFoldedEnum.Fold> | Action<IsAsideFoldedEnum.UnFold>;

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


export enum HouseListEnum
{
    SELECT = 'SELECT',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    INSERT = 'INSERT'
}
export type HouseListType = ActionProps<string, any>;

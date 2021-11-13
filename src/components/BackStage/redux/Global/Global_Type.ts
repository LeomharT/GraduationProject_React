import { Action } from 'redux';

export enum IsAsideFoldedEnum
{
    Fold = 'Fold',
    UnFold = 'UnFold',
}
export type IsAsideFoldedType = Action<IsAsideFoldedEnum.Fold> | Action<IsAsideFoldedEnum.UnFold>;

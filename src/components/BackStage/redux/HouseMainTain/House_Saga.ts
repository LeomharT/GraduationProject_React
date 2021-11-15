import createSagaMiddleware, { SagaIterator } from 'redux-saga';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { HouseBaseInfo, HouseDetailInfo } from '../../../../interfaces/HouseListInterface';
import { ActionProps } from '../Global/Global_Type';
import { SelectHouseListApi, UpdateHouseListApi } from './House_Api';
import { HouseListEnum } from './House_Type';

export function* SelectHouseList(): SagaIterator
{
    try
    {
        yield put({
            type: HouseListEnum.SELECT,
            payload: yield call(SelectHouseListApi),
        });
    } catch (err)
    {
        throw new Error(err as string);
    }
}
export function* UpdateHouseList(payload: HouseBaseInfo & HouseDetailInfo): SagaIterator
{
    try
    {
        yield put({
            type: HouseListEnum.UPDATE,
            payload: yield call(UpdateHouseListApi, payload),
        });
    } catch (err)
    {
        throw new Error(err as string);
    }
}
export function* RootSagaHouseList()
{
    yield all([
        call(function* ()
        {
            yield takeEvery('SelectHouseList', SelectHouseList);
        }),
        call(function* ()
        {
            yield takeEvery('UpdateHouseList', (action: ActionProps<HouseListEnum, HouseBaseInfo & HouseDetailInfo>) => UpdateHouseList(action.payload));
        }),
    ]);
}
export const sagaMiddlewareHouseList = createSagaMiddleware();

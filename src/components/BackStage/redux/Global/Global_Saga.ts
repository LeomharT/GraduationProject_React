import createSagaMiddleware, { SagaIterator } from 'redux-saga';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { SelectHouseListApi, SelectRepairListApi } from './Global_Api';
import { HouseListEnum } from './Global_Type';

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
export function* SelectRepairList(): SagaIterator
{
    try
    {
        yield put({
            type: HouseListEnum.SELECT,
            payload: yield call(SelectRepairListApi),
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
            yield takeEvery('SelectRepairList', SelectRepairList);
        }),
    ]);
}
export const sagaMiddlewareHouseList = createSagaMiddleware();

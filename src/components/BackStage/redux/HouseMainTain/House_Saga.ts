import createSagaMiddleware, { SagaIterator } from 'redux-saga';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { SelectHouseListApi } from './House_Api';
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

export function* RootSagaHouseList()
{
    yield all([
        call(function* ()
        {
            yield takeEvery('SelectHouseList', SelectHouseList);
        })
    ]);
}
export const sagaMiddlewareHouseList = createSagaMiddleware();

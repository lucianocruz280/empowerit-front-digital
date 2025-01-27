import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, SalesOrderListState } from './orderListSlice'
import reducersInscriptions, { InscriptionsListState } from './inscriptionsSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
    inscriptions: reducersInscriptions
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: SalesOrderListState
            inscriptions: InscriptionsListState
        },
    }
> = useSelector

export { useAppDispatch } from '@/store'
export default reducer

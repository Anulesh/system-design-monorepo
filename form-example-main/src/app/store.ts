import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import instancesReducer from '../features/instancesSlice'
import instanceChangesReducer from '../features/instanceChangesSlice'
import instanceRequestsReducer from '../features/instanceRequestsSlice'

export const store = configureStore({
    reducer: {
        instances: instancesReducer,
        instanceChanges: instanceChangesReducer,
        instanceRequests: instanceRequestsReducer,
    },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

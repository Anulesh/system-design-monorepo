import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { fetchInstanceRequest, fetchListRequest } from './instanceRequestsSlice'

import type { RootState } from '../app/store'
import { Instance, InstanceResponse, Instances, REQUEST_METHOD } from '../interfaces'

const initialState: Instances = {}

export const instancesSlice = createSlice({
    name: 'instances',
    initialState,
    reducers: {
        addInstance: (state, { payload: instance }: PayloadAction<Instance>) => {
            state[instance.id] = instance
        },
        removeInstance: (state, { payload }: PayloadAction<number>) => {
            delete state[payload]
        },
    },
    extraReducers: (builder) => {
        builder
            // Store the instance that has been fetched or updated
            .addCase(fetchInstanceRequest.fulfilled, (state, action) => {
                if ([REQUEST_METHOD.GET, REQUEST_METHOD.PATCH].includes(action.meta.arg.requestMethod)) {
                    state[action.meta.arg.id] = action.payload.data as Instance
                } else if (action.meta.arg.requestMethod === REQUEST_METHOD.DELETE) {
                    delete state[action.meta.arg.id]
                }
            })
            // Make sure that instance that return a 404 error are not in store.
            .addCase(fetchInstanceRequest.rejected, (state, action) => {
                const response = action.payload as InstanceResponse
                if (response.status === 404) {
                    delete state[action.meta.arg.id]
                }
            })
            // Store the instances that have been fetched or the instance that has been created.
            .addCase(fetchListRequest.fulfilled, (state, action) => {
                if (action.meta.arg.requestMethod === REQUEST_METHOD.GET) {
                    ;(action.payload.data as Instance[]).forEach((instance) => {
                        state[instance.id] = instance
                    })
                } else if (action.meta.arg.requestMethod === REQUEST_METHOD.POST) {
                    const newInstance = action.payload.data as Instance
                    state[newInstance.id] = newInstance
                }
            })
    },
})

export const { addInstance, removeInstance } = instancesSlice.actions

/**
 * Returns the instance that belong to the given instance ID.
 *
 * Returns `undefined` if there is no corresponding instance.
 *
 * @param state The Redux store state.
 * @param id The ID of the desired instance.
 * @returns `undefined` if there are no corresponding instance, an
 * Instance object otherwise.
 */
export function selectInstance(state: RootState, id: number): Instance | undefined {
    return state.instances[id]
}

export default instancesSlice.reducer

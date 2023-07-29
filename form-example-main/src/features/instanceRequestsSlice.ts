import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../app/store'

import { ServerCommunicator } from '../fakeServer'
import type {
    Instance,
    InstanceChanges,
    InstanceRequestsActionPayload,
    InstanceRequestsState,
    RequestState,
} from '../interfaces'
import { REQUEST_METHOD } from '../interfaces'

const initialState: InstanceRequestsState = {
    instance: {},
    list: {},
}

/**
 * Sends the specified request towards the instance that belongs to the given
 * ID.
 *
 * If the request method is "patch", then the payload will be added to the
 * request.
 *
 * Invalid request methods will be ignored.
 *
 * Valid request methods are "get", "patch", and "delete".
 *
 * @param id The ID of the instance this request belongs to.
 * @param requestMethod The request method that should be used.
 * @param payload An InstanceChanges object containing changes to the instance
 * the given `id` belongs to. This will be used only if `requestMethod` is
 * "patch" and will be ignored otherwise.
 */
export const fetchInstanceRequest = createAsyncThunk(
    'instanceRequests/fetchInstanceRequest',
    async (arg: InstanceRequestsActionPayload, thunkAPI) => {
        const { id, requestMethod, payload } = arg
        switch (requestMethod) {
            case REQUEST_METHOD.GET:
                return await ServerCommunicator.get(id).catch((response) => {
                    throw thunkAPI.rejectWithValue(response)
                })
            case REQUEST_METHOD.PATCH:
                return await ServerCommunicator.patch(id, payload ?? {}).catch((response) => {
                    throw thunkAPI.rejectWithValue(response)
                })
            case REQUEST_METHOD.DELETE:
                return await ServerCommunicator.delete(id).catch((response) => {
                    throw thunkAPI.rejectWithValue(response)
                })
            default:
                return thunkAPI.rejectWithValue(
                    'Invalid request method!\n' +
                        `requestMethod: "${requestMethod}"\n` +
                        `Valid request methods: "${REQUEST_METHOD.GET}", "${REQUEST_METHOD.PATCH}", "${REQUEST_METHOD.DELETE}"`
                )
        }
    }
)

/**
 * Sends the specified request towards the instance list.
 *
 * If the request method is "post", then the payload will be added to the
 * request.
 *
 * Invalid request methods will be ignored.
 *
 * Valid request methods are "get", "and "post".
 *
 * @param requestMethod The request method that should be used.
 * @param payload An InstanceChanges object containing a new instance. This
 * will be used only if `requestMethod` is "post" and will be ignored
 * otherwise.
 */
export const fetchListRequest = createAsyncThunk(
    'instanceRequests/fetchListRequest',
    async (arg: { requestMethod: REQUEST_METHOD; payload?: InstanceChanges }, thunkAPI) => {
        const { requestMethod, payload } = arg
        switch (requestMethod) {
            case REQUEST_METHOD.GET:
                return await ServerCommunicator.get().catch((response) => {
                    throw thunkAPI.rejectWithValue(response)
                })
            case REQUEST_METHOD.POST:
                return await ServerCommunicator.post(payload as Omit<Instance, 'id'>).catch((response) => {
                    throw thunkAPI.rejectWithValue(response)
                })
            default:
                return thunkAPI.rejectWithValue(
                    'Invalid request method!\n' +
                        `requestMethod: "${requestMethod}"\n` +
                        `Valid request methods: "${REQUEST_METHOD.GET}", "${REQUEST_METHOD.POST}"`
                )
        }
    }
)

export const instanceRequestsSlice = createSlice({
    name: 'instanceRequests',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInstanceRequest.pending, (state, action) => {
                state.instance[action.meta.arg.id] = {
                    [action.meta.arg.requestMethod]: { state: 'pending' },
                }
            })
            .addCase(fetchInstanceRequest.fulfilled, (state, action) => {
                state.instance[action.meta.arg.id] = {
                    [action.meta.arg.requestMethod]: { state: 'fulfilled', response: action.payload },
                }
            })
            .addCase(fetchInstanceRequest.rejected, (state, action) => {
                state.instance[action.meta.arg.id] = {
                    [action.meta.arg.requestMethod]: { state: 'rejected', response: action.payload },
                }
            })
            .addCase(fetchListRequest.pending, (state, action) => {
                state.list = {
                    [action.meta.arg.requestMethod]: { state: 'pending' },
                }
            })
            .addCase(fetchListRequest.fulfilled, (state, action) => {
                state.list = {
                    [action.meta.arg.requestMethod]: { state: 'fulfilled', response: action.payload },
                }
            })
            .addCase(fetchListRequest.rejected, (state, action) => {
                state.list = {
                    [action.meta.arg.requestMethod]: { state: 'rejected', response: action.payload },
                }
            })
    },
})

/**
 * Selects and returns the request state that belongs to the given instance ID
 * and request method.
 *
 * This may return `undefined` if the desired request state is not present.
 *
 * The request method "post" will always yield `undefined` as "post" is invalid
 * in the context of a single instance.
 *
 * @param state The Redux root store state.
 * @param instanceId The ID of the instance that the desired request belongs
 * to.
 * @param requestMethod The requests method. This may be "get", "patch", or
 * "delete".
 * @returns Either `undefined` if the appropriate request state couldn't be
 * found, or a RequestState object containing the state and the response of
 * the request.
 */
export function selectInstanceRequest(
    state: RootState,
    instanceId: number,
    requestMethod: REQUEST_METHOD
): RequestState | undefined {
    if (requestMethod === REQUEST_METHOD.POST) {
        return undefined
    }
    const instanceRequestsState = state.instanceRequests.instance[instanceId]
    if (!instanceRequestsState) {
        return undefined
    }
    return instanceRequestsState[requestMethod]
}

/**
 * Selects and returns the request state with given request method of requests
 * that have been made agains the instance list.
 *
 * This may return `undefined` if the desired request state is not present.
 *
 * The request methods "patch" and "delete" will always yield `undefined` as
 * those request methods are invalid in the context of a list of instances.
 *
 * @param state The Redux root store state.
 * @param requestMethod The requests method. This may be "get" or "post".
 * @returns Either `undefined` if the appropriate request state couldn't be
 * found, or a RequestState object containing the state and the response of
 * the request.
 */
export function selectListRequest(state: RootState, requestMethod: REQUEST_METHOD): RequestState | undefined {
    if (requestMethod === REQUEST_METHOD.PATCH || requestMethod === REQUEST_METHOD.DELETE) {
        return undefined
    }
    return state.instanceRequests.list[requestMethod]
}

export default instanceRequestsSlice.reducer

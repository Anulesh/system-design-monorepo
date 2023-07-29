import instanceRequestsReducer, {
    fetchInstanceRequest,
    fetchListRequest,
    selectInstanceRequest,
    selectListRequest,
} from './instanceRequestsSlice'

import { serverState } from '../fakeServer'
import type { InstanceRequestsState } from '../interfaces'
import { REQUEST_METHOD } from '../interfaces'
import { RootState } from '../app/store'

const initialState: InstanceRequestsState = {
    instance: {},
    list: {
        get: {
            state: 'fulfilled',
            response: {
                status: 200,
                statusText: 'Ok',
                data: [{ id: 1, firstName: 'Foo', lastName: 'Bar', age: 1, rating: 1 }],
            },
        },
    },
}

describe('instance requests reducer', () => {
    it('should handle initial state', () => {
        expect(instanceRequestsReducer(undefined, { type: 'unknown' })).toEqual({
            instance: {},
            list: {},
        })
        expect(instanceRequestsReducer(initialState, { type: 'unknown' })).toEqual(initialState)
    })

    it('should handle pending fetchInstanceRequest', () => {
        const state: InstanceRequestsState = {
            instance: {},
            list: {},
        }
        const action = {
            type: fetchInstanceRequest.pending.type.toString(),
            meta: {
                arg: {
                    id: 1,
                    requestMethod: REQUEST_METHOD.GET,
                },
            },
        }
        const expectedState: InstanceRequestsState = {
            instance: {
                1: {
                    get: {
                        state: 'pending',
                    },
                },
            },
            list: {},
        }
        expect(instanceRequestsReducer(state, action)).toEqual(expectedState)
    })

    it('should handle fulfilled fetchInstanceRequest', () => {
        const state: InstanceRequestsState = {
            instance: {
                1: {
                    get: {
                        state: 'pending',
                    },
                },
            },
            list: {},
        }
        const response = {
            status: 200,
            statusText: 'Ok',
            data: {
                id: 1,
                firstName: 'Foo',
                lastName: 'Bar',
                age: 1,
                rating: 1,
            },
        }
        const action = {
            type: fetchInstanceRequest.fulfilled.type.toString(),
            payload: response,
            meta: {
                arg: {
                    id: 1,
                    requestMethod: REQUEST_METHOD.GET,
                },
            },
        }
        const expectedState: InstanceRequestsState = {
            instance: {
                1: {
                    get: {
                        state: 'fulfilled',
                        response,
                    },
                },
            },
            list: {},
        }
        expect(instanceRequestsReducer(state, action)).toEqual(expectedState)
    })

    it('should handle rejected fetchInstanceRequest', () => {
        const state: InstanceRequestsState = {
            instance: {
                1: {
                    get: {
                        state: 'pending',
                    },
                },
            },
            list: {},
        }
        const response = {
            status: 404,
            statusText: 'Not Found',
            data: {
                non_field_erorrs: 'There is no instance with ID=1!',
            },
        }
        const action = {
            type: fetchInstanceRequest.rejected.type.toString(),
            payload: response,
            meta: {
                arg: {
                    id: 1,
                    requestMethod: REQUEST_METHOD.GET,
                },
            },
        }
        const expectedState: InstanceRequestsState = {
            instance: {
                1: {
                    get: {
                        state: 'rejected',
                        response,
                    },
                },
            },
            list: {},
        }
        expect(instanceRequestsReducer(state, action)).toEqual(expectedState)
    })

    it('should handle pending fetchListRequest', () => {
        const state: InstanceRequestsState = {
            instance: {},
            list: {},
        }
        const action = {
            type: fetchListRequest.pending.type.toString(),
            meta: {
                arg: {
                    requestMethod: REQUEST_METHOD.GET,
                },
            },
        }
        const expectedState: InstanceRequestsState = {
            instance: {},
            list: {
                get: {
                    state: 'pending',
                },
            },
        }
        expect(instanceRequestsReducer(state, action)).toEqual(expectedState)
    })

    it('should handle fulfilled fetchListRequest', () => {
        const state: InstanceRequestsState = {
            instance: {},
            list: {
                get: {
                    state: 'pending',
                },
            },
        }
        const response = {
            status: 200,
            statusText: 'Ok',
            data: [
                {
                    id: 1,
                    firstName: 'Foo',
                    lastName: 'Bar',
                    age: 1,
                    rating: 1,
                },
            ],
        }
        const action = {
            type: fetchListRequest.fulfilled.type.toString(),
            payload: response,
            meta: {
                arg: {
                    requestMethod: REQUEST_METHOD.GET,
                },
            },
        }
        const expectedState: InstanceRequestsState = {
            instance: {},
            list: {
                get: {
                    state: 'fulfilled',
                    response,
                },
            },
        }
        expect(instanceRequestsReducer(state, action)).toEqual(expectedState)
    })

    it('should handle rejected fetchListRequest', () => {
        const state: InstanceRequestsState = {
            instance: {},
            list: {
                post: {
                    state: 'pending',
                },
            },
        }
        const response = {
            status: 400,
            statusText: 'Bad Request',
            data: {
                firstName: 'First name is required!',
            },
        }
        const action = {
            type: fetchListRequest.rejected.type.toString(),
            payload: response,
            meta: {
                arg: {
                    requestMethod: REQUEST_METHOD.POST,
                    payload: {
                        lastName: 'Bar',
                        age: 1,
                        rating: 1,
                    },
                },
            },
        }
        const expectedState: InstanceRequestsState = {
            instance: {},
            list: {
                post: {
                    state: 'rejected',
                    response,
                },
            },
        }
        expect(instanceRequestsReducer(state, action)).toEqual(expectedState)
    })
})

describe('fetchInstanceRequest', () => {
    it('should handle fetching an instance', async () => {
        const thunk = fetchInstanceRequest({ id: 1, requestMethod: REQUEST_METHOD.GET })
        let wasPending = false
        let wasFulfilled = false
        let wasRejected = false
        const result: any = await thunk(
            (action: any) => {
                if (action.type === 'instanceRequests/fetchInstanceRequest/pending') {
                    wasPending = true
                } else if (action.type === 'instanceRequests/fetchInstanceRequest/fulfilled') {
                    wasFulfilled = true
                } else if (action.type === 'instanceRequests/fetchInstanceRequest/rejected') {
                    wasRejected = true
                }
            },
            () => initialState,
            {}
        )
        expect(wasPending).toBe(true)
        expect(wasFulfilled).toBe(true)
        expect(wasRejected).toBe(false)
        expect(result.payload.status).toBe(200)
        expect(result.payload.statusText).toBe('Ok')
        expect(result.payload.data).toEqual(serverState[1])
    })

    it('should handle failing to fetch an instance', async () => {
        const invalidId = Math.max(0, ...Object.values(serverState).map((instance) => instance.id)) + 1
        const thunk = fetchInstanceRequest({ id: invalidId, requestMethod: REQUEST_METHOD.GET })
        let wasPending = false
        let wasFulfilled = false
        let wasRejected = false
        const result: any = await thunk(
            (action: any) => {
                if (action.type === 'instanceRequests/fetchInstanceRequest/pending') {
                    wasPending = true
                } else if (action.type === 'instanceRequests/fetchInstanceRequest/fulfilled') {
                    wasFulfilled = true
                } else if (action.type === 'instanceRequests/fetchInstanceRequest/rejected') {
                    wasRejected = true
                }
            },
            () => initialState,
            {}
        )
        expect(wasPending).toBe(true)
        expect(wasFulfilled).toBe(false)
        expect(wasRejected).toBe(true)
        expect(result.payload.status).toBe(404)
        expect(result.payload.statusText).toBe('Not Found')
        expect(result.payload.data).toEqual({
            non_field_errors: [`There is no instance with ID=${invalidId}!`],
        })
    })

    it('should handle patching an instance', async () => {
        const id = 1
        const patch = { firstName: 'Foobar' }
        const thunk = fetchInstanceRequest({
            id,
            requestMethod: REQUEST_METHOD.PATCH,
            payload: patch,
        })
        let wasPending = false
        let wasFulfilled = false
        let wasRejected = false
        const result: any = await thunk(
            (action: any) => {
                if (action.type === 'instanceRequests/fetchInstanceRequest/pending') {
                    wasPending = true
                } else if (action.type === 'instanceRequests/fetchInstanceRequest/fulfilled') {
                    wasFulfilled = true
                } else if (action.type === 'instanceRequests/fetchInstanceRequest/rejected') {
                    wasRejected = true
                }
            },
            () => initialState,
            {}
        )
        expect(wasPending).toBe(true)
        expect(wasFulfilled).toBe(true)
        expect(wasRejected).toBe(false)
        expect(result.payload.status).toBe(200)
        expect(result.payload.statusText).toBe('Ok')
        expect(result.payload.data).toEqual({
            ...serverState[id],
            ...patch,
        })
    })

    it('should handle failing to patch an instance', async () => {
        const invalidId = Math.max(0, ...Object.values(serverState).map((instance) => instance.id)) + 1
        const patch = { firstName: 'Foobar' }
        const thunk = fetchInstanceRequest({ id: invalidId, requestMethod: REQUEST_METHOD.PATCH, payload: patch })
        let wasPending = false
        let wasFulfilled = false
        let wasRejected = false
        const result: any = await thunk(
            (action: any) => {
                if (action.type === 'instanceRequests/fetchInstanceRequest/pending') {
                    wasPending = true
                } else if (action.type === 'instanceRequests/fetchInstanceRequest/fulfilled') {
                    wasFulfilled = true
                } else if (action.type === 'instanceRequests/fetchInstanceRequest/rejected') {
                    wasRejected = true
                }
            },
            () => initialState,
            {}
        )
        expect(wasPending).toBe(true)
        expect(wasFulfilled).toBe(false)
        expect(wasRejected).toBe(true)
        expect(result.payload.status).toBe(404)
        expect(result.payload.statusText).toBe('Not Found')
        expect(result.payload.data).toEqual({
            non_field_errors: [`There is no instance with ID=${invalidId}!`],
        })
    })

    it('should handle deleting an instance', async () => {
        const id = 1
        const thunk = fetchInstanceRequest({
            id,
            requestMethod: REQUEST_METHOD.DELETE,
        })
        let wasPending = false
        let wasFulfilled = false
        let wasRejected = false
        const result: any = await thunk(
            (action: any) => {
                if (action.type === 'instanceRequests/fetchInstanceRequest/pending') {
                    wasPending = true
                } else if (action.type === 'instanceRequests/fetchInstanceRequest/fulfilled') {
                    wasFulfilled = true
                } else if (action.type === 'instanceRequests/fetchInstanceRequest/rejected') {
                    wasRejected = true
                }
            },
            () => initialState,
            {}
        )
        expect(wasPending).toBe(true)
        expect(wasFulfilled).toBe(true)
        expect(wasRejected).toBe(false)
        expect(result.payload.status).toBe(204)
        expect(result.payload.statusText).toBe('No Content')
        expect(typeof result.payload.data === 'undefined').toBe(true)
    })

    it('should handle failing to delete an instance', async () => {
        const invalidId = Math.max(0, ...Object.values(serverState).map((instance) => instance.id)) + 1
        const thunk = fetchInstanceRequest({ id: invalidId, requestMethod: REQUEST_METHOD.DELETE })
        let wasPending = false
        let wasFulfilled = false
        let wasRejected = false
        const result: any = await thunk(
            (action: any) => {
                if (action.type === 'instanceRequests/fetchInstanceRequest/pending') {
                    wasPending = true
                } else if (action.type === 'instanceRequests/fetchInstanceRequest/fulfilled') {
                    wasFulfilled = true
                } else if (action.type === 'instanceRequests/fetchInstanceRequest/rejected') {
                    wasRejected = true
                }
            },
            () => initialState,
            {}
        )
        expect(wasPending).toBe(true)
        expect(wasFulfilled).toBe(false)
        expect(wasRejected).toBe(true)
        expect(result.payload.status).toBe(404)
        expect(result.payload.statusText).toBe('Not Found')
        expect(result.payload.data).toEqual({
            non_field_errors: [`There is no instance with ID=${invalidId}!`],
        })
    })

    it('should handle invalid request method', async () => {
        const id = 1
        const thunk = fetchInstanceRequest({ id, requestMethod: REQUEST_METHOD.POST, payload: { firstName: 'foobar' } })
        let wasPending = false
        let wasFulfilled = false
        let wasRejected = false
        const result: any = await thunk(
            (action: any) => {
                if (action.type === 'instanceRequests/fetchInstanceRequest/pending') {
                    wasPending = true
                } else if (action.type === 'instanceRequests/fetchInstanceRequest/fulfilled') {
                    wasFulfilled = true
                } else if (action.type === 'instanceRequests/fetchInstanceRequest/rejected') {
                    wasRejected = true
                }
            },
            () => initialState,
            {}
        )
        expect(wasPending).toBe(true)
        expect(wasFulfilled).toBe(false)
        expect(wasRejected).toBe(true)
        expect(result.payload).toEqual(
            'Invalid request method!\n' +
                `requestMethod: "${REQUEST_METHOD.POST}"\n` +
                `Valid request methods: "${REQUEST_METHOD.GET}", "${REQUEST_METHOD.PATCH}", "${REQUEST_METHOD.DELETE}"`
        )
    })
})

describe('fetchListRequest', () => {
    it('should handle fetching all instances', async () => {
        const thunk = fetchListRequest({ requestMethod: REQUEST_METHOD.GET })
        const expectedData = Object.values(serverState)
        expectedData.sort(({ id: idA }, { id: idB }) => idA - idB)
        let wasPending = false
        let wasFulfilled = false
        let wasRejected = false
        const result: any = await thunk(
            (action: any) => {
                if (action.type === 'instanceRequests/fetchListRequest/pending') {
                    wasPending = true
                } else if (action.type === 'instanceRequests/fetchListRequest/fulfilled') {
                    wasFulfilled = true
                } else if (action.type === 'instanceRequests/fetchListRequest/rejected') {
                    wasRejected = true
                }
            },
            () => initialState,
            {}
        )
        expect(wasPending).toBe(true)
        expect(wasFulfilled).toBe(true)
        expect(wasRejected).toBe(false)
        expect(result.payload.status).toBe(200)
        expect(result.payload.statusText).toBe('Ok')
        expect(result.payload.data).toEqual(expectedData)
    })

    // it('should handle failing to fetch all instances', async () => {
    //     // NOTE: This example is incapable of failing to retrieve all instances.
    // })

    it('should handle posting an instance', async () => {
        const newInstance = {
            firstName: 'Foo',
            lastName: 'Bar',
            age: 1,
            rating: 1,
        }
        const thunk = fetchListRequest({
            requestMethod: REQUEST_METHOD.POST,
            payload: newInstance,
        })
        let wasPending = false
        let wasFulfilled = false
        let wasRejected = false
        const result: any = await thunk(
            (action: any) => {
                if (action.type === 'instanceRequests/fetchListRequest/pending') {
                    wasPending = true
                } else if (action.type === 'instanceRequests/fetchListRequest/fulfilled') {
                    wasFulfilled = true
                } else if (action.type === 'instanceRequests/fetchListRequest/rejected') {
                    wasRejected = true
                }
            },
            () => initialState,
            {}
        )
        expect(wasPending).toBe(true)
        expect(wasFulfilled).toBe(true)
        expect(wasRejected).toBe(false)
        expect(result.payload.status).toBe(201)
        expect(result.payload.statusText).toBe('Created')
        expect(result.payload.data).toEqual({
            id: result.payload.data.id,
            ...newInstance,
        })
    })

    it('should handle failing to post an instance', async () => {
        const invalidInstance = {
            firstName: 'Foo',
            age: 1,
            rating: 1,
        }
        const thunk = fetchListRequest({ requestMethod: REQUEST_METHOD.POST, payload: invalidInstance })
        let wasPending = false
        let wasFulfilled = false
        let wasRejected = false
        const result: any = await thunk(
            (action: any) => {
                if (action.type === 'instanceRequests/fetchListRequest/pending') {
                    wasPending = true
                } else if (action.type === 'instanceRequests/fetchListRequest/fulfilled') {
                    wasFulfilled = true
                } else if (action.type === 'instanceRequests/fetchListRequest/rejected') {
                    wasRejected = true
                }
            },
            () => initialState,
            {}
        )
        expect(wasPending).toBe(true)
        expect(wasFulfilled).toBe(false)
        expect(wasRejected).toBe(true)
        expect(result.payload.status).toBe(400)
        expect(result.payload.statusText).toBe('Bad Request')
        expect(result.payload.data).toEqual({
            lastName: 'Last name is required!',
        })
    })

    it('should handle invalid request method', async () => {
        const thunk = fetchListRequest({ requestMethod: REQUEST_METHOD.PATCH })
        let wasPending = false
        let wasFulfilled = false
        let wasRejected = false
        const result: any = await thunk(
            (action: any) => {
                if (action.type === 'instanceRequests/fetchListRequest/pending') {
                    wasPending = true
                } else if (action.type === 'instanceRequests/fetchListRequest/fulfilled') {
                    wasFulfilled = true
                } else if (action.type === 'instanceRequests/fetchListRequest/rejected') {
                    wasRejected = true
                }
            },
            () => initialState,
            {}
        )
        expect(wasPending).toBe(true)
        expect(wasFulfilled).toBe(false)
        expect(wasRejected).toBe(true)
        expect(result.payload).toEqual(
            'Invalid request method!\n' +
                `requestMethod: "${REQUEST_METHOD.PATCH}"\n` +
                `Valid request methods: "${REQUEST_METHOD.GET}", "${REQUEST_METHOD.POST}"`
        )
    })
})

describe('instance request selector', () => {
    const state = {
        instanceRequests: {
            instance: {
                1: {
                    get: {
                        state: 'fulfilled',
                        response: {
                            status: 200,
                            statusText: 'Ok',
                            data: { id: 1, firstName: 'Foo', lastName: 'Bar', age: 1, rating: 1 },
                        },
                    },
                },
            },
            list: {},
        },
        // Note: we force the type to avoid defining the state of otehr slices here.
    } as unknown as RootState

    it('should select the appropriate request state', () => {
        const id = 1
        const result = selectInstanceRequest(state, id, REQUEST_METHOD.GET)
        expect(result).toEqual(state.instanceRequests.instance[id].get)
    })

    it('should handle missing request state', () => {
        const resultMissingId = selectInstanceRequest(state, 2, REQUEST_METHOD.GET)
        expect(typeof resultMissingId === 'undefined').toBe(true)
        const resultMissingRequestMethod = selectInstanceRequest(state, 1, REQUEST_METHOD.PATCH)
        expect(typeof resultMissingRequestMethod === 'undefined').toBe(true)
    })

    it('should handle invalid request method', () => {
        const result = selectInstanceRequest(state, 1, REQUEST_METHOD.POST)
        expect(typeof result === 'undefined').toBe(true)
    })
})

describe('list request selector', () => {
    const state = {
        instanceRequests: {
            instance: {},
            list: {
                get: {
                    state: 'fulfilled',
                    response: {
                        status: 200,
                        statusText: 'Ok',
                        data: [{ id: 1, firstName: 'Foo', lastName: 'Bar', age: 1, rating: 1 }],
                    },
                },
            },
        },
        // Note: we force the type to avoid defining the state of otehr slices here.
    } as unknown as RootState

    it('should select the appropriate request state', () => {
        const result = selectListRequest(state, REQUEST_METHOD.GET)
        expect(result).toEqual(state.instanceRequests.list.get)
    })

    it('should handle missing request state', () => {
        const result = selectListRequest(state, REQUEST_METHOD.POST)
        expect(typeof result === 'undefined').toBe(true)
    })

    it('should handle invalid request method', () => {
        const resultPatch = selectListRequest(state, REQUEST_METHOD.PATCH)
        expect(typeof resultPatch === 'undefined').toBe(true)
        const resultDelete = selectListRequest(state, REQUEST_METHOD.PATCH)
        expect(typeof resultDelete === 'undefined').toBe(true)
    })
})

import instancesReducer, { addInstance, removeInstance, selectInstance } from './instancesSlice'

import type { RootState } from '../app/store'
import { Instances, REQUEST_METHOD } from '../interfaces'
import { fetchInstanceRequest, fetchListRequest } from './instanceRequestsSlice'

describe('instances reducer', () => {
    const initialState: Instances = {
        1: {
            id: 1,
            firstName: 'Roslaynne',
            lastName: 'Boone',
            age: 35,
            rating: 2,
        },
        2: {
            id: 2,
            firstName: 'Coty',
            lastName: 'Chrysanta',
            age: 30,
            rating: 3,
        },
    }

    it('should handle initial state', () => {
        expect(instancesReducer(undefined, { type: 'unknown' })).toEqual({})
        expect(instancesReducer(initialState, { type: 'unknown' })).toEqual(initialState)
    })

    it('should handle adding an instance', () => {
        const instance = {
            id: 1,
            firstName: 'Roslaynne',
            lastName: 'Boone',
            age: 35,
            rating: 2,
        }
        const resultState = instancesReducer({}, addInstance(instance))
        expect(resultState).toEqual({
            [instance.id]: instance,
        })
    })

    it('should handle removing an instance', () => {
        const resultState = instancesReducer(initialState, removeInstance(2))
        expect(resultState).toEqual({
            1: initialState[1],
        })
    })

    it('should handle fulfilled instance GET requests', () => {
        const id = 1
        const resultStateGET = instancesReducer(
            {},
            {
                type: fetchInstanceRequest.fulfilled.toString(),
                meta: { arg: { id, requestMethod: REQUEST_METHOD.GET } },
                payload: { status: 200, statusText: 'Ok', data: initialState[id] },
            }
        )
        expect(resultStateGET).toEqual({
            [id]: initialState[id],
        })
    })

    it('should handle fulfilled instance PATCH requests', () => {
        const id = 1
        const patchedInstance = {
            ...initialState[id],
            firstName: 'Foobar',
        }
        const resultStatePATCH = instancesReducer(initialState, {
            type: fetchInstanceRequest.fulfilled.toString(),
            meta: { arg: { id, requestMethod: REQUEST_METHOD.PATCH } },
            payload: { status: 200, statusText: 'Ok', data: patchedInstance },
        })
        expect(resultStatePATCH).toEqual({
            ...initialState,
            [patchedInstance.id]: patchedInstance,
        })
    })

    it('should handle fulfilled instance DELETE requests', () => {
        const id = 1
        const resultStateDELETE = instancesReducer(
            {
                [id]: initialState[id],
            },
            {
                type: fetchInstanceRequest.fulfilled.toString(),
                meta: { arg: { id, requestMethod: REQUEST_METHOD.DELETE } },
                payload: { status: 204, statusText: 'No Content' },
            }
        )
        expect(resultStateDELETE).toEqual({})
    })

    it('should ignore fulfilled instance POST requests', () => {
        const resultStatePOST = instancesReducer(
            {},
            {
                type: fetchInstanceRequest.fulfilled.toString(),
                meta: { arg: { requestMethod: REQUEST_METHOD.POST } },
                payload: { status: 405, statusText: 'Method Not Allowed', data: initialState[1] },
            }
        )
        expect(resultStatePOST).toEqual({})
    })

    it('should handle fulfilled list GET requests', () => {
        const resultStateGET = instancesReducer(
            {},
            {
                type: fetchListRequest.fulfilled.toString(),
                meta: { arg: { requestMethod: REQUEST_METHOD.GET } },
                payload: { status: 200, statusText: 'Ok', data: Object.values(initialState) },
            }
        )
        expect(resultStateGET).toEqual(initialState)
    })

    it('should handle fulfilled list POST requests', () => {
        const resultStatePOST = instancesReducer(
            {},
            {
                type: fetchListRequest.fulfilled.toString(),
                meta: { arg: { requestMethod: REQUEST_METHOD.POST } },
                payload: { status: 200, statusText: 'Ok', data: initialState[1] },
            }
        )
        expect(resultStatePOST).toEqual({
            1: initialState[1],
        })
    })

    it('should handle fulfilled list DELETE and PATCH requests', () => {
        const id = 1
        const patchedInstance = {
            ...initialState[id],
            firstName: 'Foobar',
        }
        const resultStatePATCH = instancesReducer(initialState, {
            type: fetchListRequest.fulfilled.toString(),
            meta: { arg: { requestMethod: REQUEST_METHOD.PATCH } },
            payload: { status: 200, statusText: 'Ok', data: patchedInstance },
        })
        expect(resultStatePATCH).toEqual(initialState)
        const resultStateDELETE = instancesReducer(initialState, {
            type: fetchListRequest.fulfilled.toString(),
            meta: { arg: { id, requestMethod: REQUEST_METHOD.DELETE } },
            payload: { status: 204, statusText: 'No Content' },
        })
        expect(resultStateDELETE).toEqual(initialState)
    })
})

describe('selectInstance', () => {
    const state = {
        instances: {
            1: {
                id: 1,
                firstName: 'Roslaynne',
                lastName: 'Boone',
                age: 35,
                rating: 2,
            },
            2: {
                id: 2,
                firstName: 'Coty',
                lastName: 'Chrysanta',
                age: 30,
                rating: 3,
            },
        },
        // Note: we force the type to avoid defining the state of otehr slices here.
    } as unknown as RootState

    it('should return the correct instance', () => {
        const instance = selectInstance(state, 2)
        expect(instance).toEqual(state.instances[2])
    })

    it('should return undefined for invalid instance IDs', () => {
        const instance = selectInstance(state, 3)
        expect(typeof instance === 'undefined').toBe(true)
    })
})

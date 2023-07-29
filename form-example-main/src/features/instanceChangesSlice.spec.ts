import instanceChangesReducer, {
    setInstanceChanges,
    clearInstanceChanges,
    updateInstanceChanges,
    selectInstanceChanges,
} from './instanceChangesSlice'

import type { RootState } from '../app/store'
import type { InstancesChanges } from '../interfaces'

describe('instance changes reducer', () => {
    const initialState: InstancesChanges = {
        1: {
            firstName: 'Foo',
            lastName: 'Bar',
        },
        2: {
            age: 5,
        },
        3: {
            rating: 3,
        },
    }
    it('should handle initial state', () => {
        expect(instanceChangesReducer(undefined, { type: 'unknown' })).toEqual({})
        expect(instanceChangesReducer(initialState, { type: 'unknown' })).toEqual(initialState)
    })

    it('should handle adding changes for an instance', () => {
        const id = 1
        const changes = { firstName: 'foobar' }
        const actual = instanceChangesReducer({}, setInstanceChanges({ id, changes }))
        expect(actual[id]).toEqual(changes)
    })

    it('should handle clearing changes', () => {
        const emptyState = instanceChangesReducer(initialState, clearInstanceChanges())
        expect(Object.keys(emptyState).length).toEqual(0)
        const reducedState = instanceChangesReducer(initialState, clearInstanceChanges(1))
        expect(reducedState).toEqual(Object.fromEntries(Object.entries(reducedState).filter(([key]) => key !== '1')))
    })

    it('should handle updating non-existing change', () => {
        const id = 4
        const patch = { firstName: 'fizzbuzz' }
        const actual = instanceChangesReducer(initialState, updateInstanceChanges({ id, patch }))
        expect(actual).toEqual({
            ...initialState,
            [id]: patch,
        })
    })

    it('should handle updating existing change', () => {
        const id = 1
        const patch = { firstName: 'fizzbuzz' }
        const actual = instanceChangesReducer(initialState, updateInstanceChanges({ id, patch }))
        expect(actual).toEqual({
            ...initialState,
            [id]: {
                ...initialState[id],
                ...patch,
            },
        })
    })
})

describe('instance changes selector', () => {
    const state = {
        instanceChanges: {
            1: {
                firstName: 'Foo',
                lastName: 'Bar',
            },
            2: {
                age: 5,
            },
            3: {
                rating: 3,
            },
        },
        // Note: we force the type to avoid defining the state of otehr slices here.
    } as unknown as RootState
    it('should select the correct instance changes', () => {
        expect(selectInstanceChanges(state, 2)).toEqual(state.instanceChanges[2])
    })
})

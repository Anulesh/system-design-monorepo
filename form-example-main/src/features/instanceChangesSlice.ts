import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../app/store'
import type { Instance, InstanceChanges, InstancesChanges } from '../interfaces'

const initialState: InstancesChanges = {}

export const instanceChangesSlice = createSlice({
    name: 'instanceChanges',
    initialState,
    reducers: {
        setInstanceChanges: (
            state,
            { payload }: PayloadAction<{ id: number; changes: Partial<Omit<Instance, 'id'>> }>
        ) => {
            state[payload.id] = payload.changes
        },

        clearInstanceChanges: (state, { payload }: PayloadAction<undefined | number>) => {
            if (typeof payload === 'number') {
                delete state[payload]
            } else {
                return {}
            }
        },

        updateInstanceChanges: (
            state,
            { payload }: PayloadAction<{ id: number; patch: Partial<Omit<Instance, 'id'>> }>
        ) => {
            const prevChanges = state[payload.id]
            if (typeof prevChanges === 'undefined') {
                state[payload.id] = payload.patch
            } else {
                state[payload.id] = {
                    ...state[payload.id],
                    ...payload.patch,
                }
            }
        },
    },
})

export const { clearInstanceChanges, setInstanceChanges, updateInstanceChanges } = instanceChangesSlice.actions

/**
 * Returns the instance changes that belong to the given instance ID.
 *
 * Returns `undefined` if there are no corresponding changes.
 *
 * @param state The Redux store state.
 * @param id The ID of the instance the desired changes belong to.
 * @returns `undefined` if there are no corresponding changes, an
 * InstanceChanges object otherwise.
 */
export function selectInstanceChanges(state: RootState, id: number): InstanceChanges | undefined {
    return state.instanceChanges[id]
}

export default instanceChangesSlice.reducer

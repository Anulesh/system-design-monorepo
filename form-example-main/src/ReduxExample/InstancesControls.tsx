import { Box, Button, Skeleton, Stack } from '@mui/material'
import * as React from 'react'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import type { FormErrors, Instance } from '../interfaces'
import { REQUEST_METHOD } from '../interfaces'
import { ErrorAlert } from '../ErrorAlert'
import { clearInstanceChanges } from '../features/instanceChangesSlice'
import { fetchListRequest, selectListRequest } from '../features/instanceRequestsSlice'
import { InstanceSelector } from './InstanceSelector'

export interface InstancesControlsProps {
    selectedinstanceId: number | null
    onSelectInstanceId: React.Dispatch<React.SetStateAction<number | null>>
}

export const InstancesControls: React.FunctionComponent<InstancesControlsProps> = (props) => {
    const { onSelectInstanceId, selectedinstanceId } = props
    const dispatch = useAppDispatch()
    const listGETRequestState = useAppSelector((state) => selectListRequest(state, REQUEST_METHOD.GET))
    const instances = useAppSelector((state) => state.instances)
    const instancesChanges = useAppSelector((state) => state.instanceChanges)

    /**
     * A list of instances in a format that the InstanceList understands.
     *
     * The labels will be the first name of the instance. An asterisk will be
     * added, if there are instance changes associated with the instance.
     *
     * This is null until the list GET request state is 'fulfilled'.
     */
    const instanceItemIds = React.useMemo(() => {
        if (!listGETRequestState || listGETRequestState.state !== 'fulfilled') {
            return null
        }
        return (listGETRequestState.response?.data as Instance[]).map((instance) => instance.id)
    }, [listGETRequestState])

    /**
     * A list of instances in a format that the InstanceList understands.
     *
     * The labels will be the first name of the instance. An asterisk will be
     * added, if there are instance changes associated with the instance.
     *
     * This is null until the list GET request state is 'fulfilled'.
     */
    const instanceItems = React.useMemo(() => {
        if (instanceItemIds === null || !instances) {
            return null
        }
        return instanceItemIds.map((instanceId) => {
            const instance = instances[instanceId] ?? { id: instanceId, firstName: 'Not Found' }
            return {
                value: instance.id,
                label: instancesChanges[instance.id] ? `${instance.firstName}*` : instance.firstName, // TODO: Add an asterisk if there are changes.
            }
        })
    }, [instanceItemIds, instances, instancesChanges])

    /**
     * Dispatches the appropriate action to remove all instance changes form
     * the store.
     */
    const clearChanges = React.useCallback(() => {
        dispatch(clearInstanceChanges())
    }, [dispatch])

    /** Dispatches the action that fetches a list of instances. */
    const fetchInstances = React.useCallback(() => {
        dispatch(fetchListRequest({ requestMethod: REQUEST_METHOD.GET }))
    }, [dispatch])

    /** Fetch a list of instances, if not done so yet. */
    React.useEffect(() => {
        if (!listGETRequestState) {
            fetchInstances()
        }
    }, [fetchInstances, listGETRequestState])

    return (
        <Box>
            {(!listGETRequestState || listGETRequestState.state === 'pending') && (
                <Box sx={{ border: '1px solid lightgray', mb: 2 }}>
                    <Skeleton height={20} sx={{ m: 1 }} />
                    <Skeleton height={20} sx={{ m: 1 }} />
                    <Skeleton height={20} sx={{ m: 1 }} />
                    <Skeleton height={20} sx={{ m: 1 }} />
                    <Skeleton height={20} sx={{ m: 1 }} />
                </Box>
            )}
            {instanceItems && (
                <InstanceSelector
                    instances={instanceItems}
                    selectedInstance={selectedinstanceId}
                    onSelectInstance={onSelectInstanceId}
                />
            )}
            {listGETRequestState &&
                listGETRequestState.state === 'rejected' &&
                Object.entries(listGETRequestState.response?.data as FormErrors).map(([key, errors], idx) => {
                    return <ErrorAlert key={idx} label={key !== 'non_field_errors' ? key : undefined} errors={errors} />
                })}
            <Stack direction={'row'} spacing={2}>
                <Button variant='contained' onClick={clearChanges}>
                    Clear Changes
                </Button>
            </Stack>
        </Box>
    )
}

export default InstancesControls

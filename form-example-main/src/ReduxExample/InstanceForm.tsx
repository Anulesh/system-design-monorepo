import * as React from 'react'
import { Box, Button, CircularProgress, Skeleton, Stack, styled } from '@mui/material'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { INSTANCE_FORM_FIELD_DEFINITIONS } from '../constants'
import { Form } from '../Form'
import type { FormErrors, FormValues, Instance } from '../interfaces'
import { InstanceEndpointStatus, REQUEST_METHOD } from '../interfaces'
import { clearInstanceChanges, setInstanceChanges } from '../features/instanceChangesSlice'
import { fetchInstanceRequest } from '../features/instanceRequestsSlice'

const FormBox = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
}))

export interface InstanceFormProps {
    instanceId: number
}

/**
 * Renders a form for displaying and modifying instances and buttons for
 * controlling changes for the displayed instance.
 *
 * This component is responsible for managing data and callbacks required to
 * display a form which displays and modifies agiven instance and buttons that
 * store or discard changes and that refresh the instance's data form the
 * server.
 */
export const InstanceForm: React.FunctionComponent<InstanceFormProps> = (props) => {
    const { instanceId } = props
    const dispatch = useAppDispatch()

    /**
     * The data of the instance from the instance slice that corresponds to
     * the selected instance ID.
     *
     * This will be `null` if no instance ID has been selected or if there is
     * no instance that corresponds to the selected instance ID.
     */
    const instance = useAppSelector((state) => state.instances[instanceId] ?? null)

    /**
     * The changes object from the instance changes slice that belong to the
     * selected instance.
     *
     * This will be `null` if no changes are stored for the selected instance.
     */
    const instanceChanges = useAppSelector((state) => state.instanceChanges[instanceId] ?? null)

    /**
     * An object containing the latest GET, PATCH, and DELETE request
     * corresponding to the instanceId.
     */
    const instanceRequests = useAppSelector((state) => state.instanceRequests.instance[instanceId] ?? {})

    /** The status of the instance that corresponds to `instanceId`. */
    const instanceStatus = React.useMemo(() => {
        if (!instance) {
            return InstanceEndpointStatus.FETCHING
        }
        if (instanceRequests.get && instanceRequests.get.state === 'pending') {
            return InstanceEndpointStatus.UPDATING
        }
        if (instanceRequests.patch && instanceRequests.patch.state === 'pending') {
            return InstanceEndpointStatus.SAVING
        }
        if (instanceRequests.delete && instanceRequests.delete.state === 'pending') {
            return InstanceEndpointStatus.DELETING
        }
        if (instanceRequests.delete && instanceRequests.delete.state === 'fulfilled') {
            return InstanceEndpointStatus.DELETED
        }
        if (
            Object.values(instanceRequests).every((request) => request.state !== 'pending') &&
            Object.values(instanceRequests).some((request) => request.state === 'rejected')
        ) {
            return InstanceEndpointStatus.ERROR
        }
        return InstanceEndpointStatus.READY
    }, [instance, instanceRequests])

    /**
     * The form field definition array used to render the form.
     *
     * NOTE: The form field definitions are considered constant and are not
     * allowed to be changed.
     */
    const formFields = React.useMemo(
        () => [
            INSTANCE_FORM_FIELD_DEFINITIONS.firstName,
            INSTANCE_FORM_FIELD_DEFINITIONS.lastName,
            INSTANCE_FORM_FIELD_DEFINITIONS.age,
            INSTANCE_FORM_FIELD_DEFINITIONS.rating,
        ],
        []
    )

    /**
     * An object taht contains the values of the form.
     *
     * The instance changes are being projected over the instance data.
     *
     * This will be an empty object if there is no instance slected.
     */
    const formValues: FormValues = React.useMemo(() => {
        if (instance === null) {
            return {}
        }
        return { ...instance, ...(instanceChanges ?? {}) }
    }, [instance, instanceChanges])

    /**
     * Errors that might have been returned by the latest PATCH request to the
     * instance.
     */
    const formErrors: FormErrors | null = React.useMemo(() => {
        if (
            !instanceRequests ||
            !instanceRequests.patch ||
            instanceRequests.patch.state !== 'rejected' ||
            !instanceRequests.patch.response ||
            instanceRequests.patch.response.status !== 400
        ) {
            return null
        }
        return (instanceRequests.patch.response.data as FormErrors) ?? null
    }, [instanceRequests])

    /**
     * Update the instanceChanges slice with the updated form values.
     *
     * This filters out values that are already stored in the instances slice.
     *
     * NOTE: This will do nothing if no instance has been selected.
     *
     * @param update Either an object contaiing the new form values or an
     * updater function that returns the updated form values object when
     * called with the current form values object a sits only argument.
     */
    const handleFormChange = React.useCallback(
        (update: FormValues | ((prev: FormValues) => FormValues)) => {
            if (instance === null) {
                return
            }
            const updatedValues = typeof update === 'function' ? update(formValues) : update
            const changes = Object.fromEntries(
                Object.entries(updatedValues).filter(
                    ([fieldKey, changedValue]) => instance[fieldKey as keyof Instance] !== changedValue
                )
            )
            if (Object.keys(changes).length === 0) {
                dispatch(clearInstanceChanges(instance.id))
            } else {
                dispatch(setInstanceChanges({ id: instance.id, changes }))
            }
        },
        [dispatch, formValues, instance]
    )

    /**
     * Dispatches an instance PATCH action to send the active changes to the
     * server.
     *
     * Once the request is fulfilled, it clears the changes from the store.
     *
     * If the request is rejected, it displays the appropriate error messages.
     */
    const saveActiveChanges = React.useCallback(async () => {
        const action = await dispatch(
            fetchInstanceRequest({ id: instanceId, requestMethod: REQUEST_METHOD.PATCH, payload: instanceChanges })
        )
        if (action.meta.requestStatus === 'fulfilled') {
            dispatch(clearInstanceChanges(instanceId))
        }
    }, [dispatch, instanceChanges, instanceId])

    /** Clears the instance changes for the displayed instance. */
    const clearChanges = React.useCallback(() => {
        dispatch(clearInstanceChanges(instanceId))
    }, [instanceId, dispatch])

    return (
        <Box>
            <Stack direction={'row'} spacing={2} sx={{ mb: 3 }}>
                <Button
                    variant='contained'
                    disabled={
                        instanceChanges === null ||
                        ![InstanceEndpointStatus.READY, InstanceEndpointStatus.ERROR].includes(instanceStatus)
                    }
                    onClick={saveActiveChanges}
                >
                    {instanceStatus === InstanceEndpointStatus.SAVING && <CircularProgress size={15} />}Save Changes
                </Button>
                <Button
                    variant='contained'
                    disabled={instanceChanges === null || instanceStatus !== InstanceEndpointStatus.READY}
                    onClick={clearChanges}
                >
                    Discard Changes
                </Button>
            </Stack>
            {instance !== null && (
                <FormBox>
                    {instanceStatus === InstanceEndpointStatus.FETCHING && (
                        <>
                            <Skeleton height={56} />
                            <Skeleton height={56} />
                            <Skeleton height={56} />
                            <Skeleton height={24} width={120} />
                        </>
                    )}
                    {instanceStatus !== InstanceEndpointStatus.FETCHING &&
                        instanceStatus !== InstanceEndpointStatus.DELETED && (
                            <Form
                                formFields={formFields}
                                values={formValues}
                                formErrors={formErrors ?? undefined}
                                onChange={handleFormChange}
                            />
                        )}
                </FormBox>
            )}
        </Box>
    )
}

export default InstanceForm

import * as React from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { Box, Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

import { InstanceForm } from './InstanceForm'
import { InstancesControls } from './InstancesControls'

import { useAppSelector } from '../app/hooks'

export const ReduxExample: React.FunctionComponent = () => {
    /** The instance ID that the user selected on the instance selector. */
    const [activeInstanceId, setActiveInstanceId] = React.useState<number | null>(null)

    /**
     * Sets the selected instance ID unless it is the one that is already
     * selected.
     * In that case, it sets the selected instance ID to `null`.
     *
     * @param selection Either the selected instance ID or a function that
     * takes the previous selected instance ID and returns the next selected
     * instance ID.
     */
    const onSelectInstanceId = React.useCallback(
        (selection: number | null | ((prevState: number | null) => number | null)): void => {
            setActiveInstanceId((prev) => {
                const next = typeof selection === 'function' ? selection(prev) : selection
                return next === prev ? null : next
            })
        },
        []
    )

    /**
     * The data of the instance from the instance slice that corresponds to
     * the selected instance ID.
     *
     * This will be `null` if no instance ID has been selected or if there is
     * no instance that corresponds to the selected instance ID.
     */
    const instance = useAppSelector((state) => {
        if (activeInstanceId === null) {
            return null
        }
        return state.instances[activeInstanceId] ?? null
    })

    return (
        <Grid container spacing={2}>
            <Grid xs={3}>
                <Paper elevation={4} sx={{ padding: 3, marginBottom: 2 }}>
                    <Typography variant='h5' sx={{ mb: 2 }}>
                        Instances
                    </Typography>
                    <InstancesControls selectedinstanceId={activeInstanceId} onSelectInstanceId={onSelectInstanceId} />
                </Paper>
            </Grid>
            <Grid xs={9}>
                <Paper elevation={4} sx={{ padding: 3 }}>
                    <Typography variant='h5' sx={{ mb: 2 }}>
                        Form
                    </Typography>
                    {activeInstanceId !== null && <InstanceForm instanceId={activeInstanceId} />}
                    {instance === null && (
                        <FormBox>
                            <Typography>{'Select an instance from the list first.'}</Typography>
                        </FormBox>
                    )}
                </Paper>
            </Grid>
        </Grid>
    )
}

export default ReduxExample

const FormBox = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
}))

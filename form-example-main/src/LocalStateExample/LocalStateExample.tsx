import * as React from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { Box, Button, Paper, Typography } from '@mui/material'

import Login from './Login'
import { FormErrors } from '../interfaces'

export interface ICredentials {
    username: String
    password: String
}

export interface ILocalStateExampleProps {}

export const LocalStateExample: React.FunctionComponent<ILocalStateExampleProps> = (props) => {
    const [credentials, setCredentials] = React.useState<ICredentials>({ username: '', password: '' })
    const [errorMessages, setErrorMessages] = React.useState<FormErrors>({})

    const handleSubmit = React.useCallback((username: String, password: String) => {
        setCredentials({ username, password })
    }, [])

    return (
        <Grid container spacing={2}>
            <Grid xs={8}>
                <Paper elevation={4} sx={{ padding: 3 }}>
                    <Typography variant='h5' sx={{ mb: 2 }}>
                        Submitted credentials:
                    </Typography>
                    <Login onSubmit={handleSubmit} errorMessage={errorMessages} />
                </Paper>
            </Grid>
            <Grid xs={4}>
                <Paper elevation={4} sx={{ padding: 3, position: 'relative' }}>
                    <Typography variant='h5' sx={{ mb: 2 }}>
                        Submitted credentials:
                    </Typography>
                    <div>
                        <span>Username:</span>{' '}
                        <span>{credentials.username.length > 0 ? `"${credentials.username}"` : ''}</span>
                    </div>
                    <div>
                        <span>Password:</span>{' '}
                        <span>{credentials.password.length > 0 ? `"${credentials.password}"` : ''}</span>
                    </div>
                    <Box sx={{ marginTop: '1rem' }}>
                        <Button
                            variant='contained'
                            onClick={() => {
                                setCredentials({ username: '', password: '' })
                                setErrorMessages({})
                            }}
                            sx={{ marginRight: '1rem' }}
                        >
                            Reset
                        </Button>
                        <Button
                            variant='contained'
                            onClick={() => {
                                const errMsgs = {
                                    non_field_errors: ['FooBar', 'FizzBuzz'],
                                } as FormErrors
                                if (credentials.username.length === 0) {
                                    errMsgs.username = ['Username is required!']
                                }
                                if (credentials.password.length === 0) {
                                    errMsgs.password = ['Password is required!']
                                }
                                setErrorMessages(errMsgs)
                            }}
                        >
                            Show Errors
                        </Button>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    )
}

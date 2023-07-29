import React from 'react'
import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

import type { FormErrors, FormValues } from '../interfaces'
import { Form } from '../Form'
import { LOGIN_FORM_FIELD_DEFINITIONS } from '../constants'

export interface ILoginProps {
    /**
     * Will be called with the username and password entered by the user once
     * the user clicks the "submit" button.
     *
     * @param username A non-empty string. The value of the input for the username.
     * @param password A non-empty string. The value of the input for the password.
     * @returns
     */
    onSubmit: (username: string, password: string) => void
    /**
     * An optional error message object which will be passed to the Form
     * component.
     */
    errorMessage?: FormErrors
}

/**
 * Renders and manages the login form.
 *
 * This may render an error message above the login form.
 */
export const Login: React.FunctionComponent<ILoginProps> = (props) => {
    const { errorMessage, onSubmit } = props
    const [username, setUsername] = React.useState<string>('')
    const [password, setPassword] = React.useState<string>('')

    const formFields = React.useMemo(() => {
        return [LOGIN_FORM_FIELD_DEFINITIONS.username, LOGIN_FORM_FIELD_DEFINITIONS.password]
    }, [])

    const formValues = React.useMemo(
        () => ({
            username,
            password,
        }),
        [username, password]
    )

    const handleFormChange = React.useCallback(
        (update: FormValues | ((prev: FormValues) => FormValues)): void => {
            if (typeof update === 'function') {
                const next = update(formValues)
                if (typeof next.username === 'string') {
                    setUsername(next.username)
                }
                if (typeof next.password === 'string') {
                    setPassword(next.password)
                }
            } else {
                if (typeof update.username === 'string') {
                    setUsername(update.username)
                }
                if (typeof update.password === 'string') {
                    setPassword(update.password)
                }
            }
        },
        [formValues]
    )

    const handleSubmit = React.useCallback(() => {
        onSubmit(username, password)
    }, [onSubmit, password, username])

    return (
        <LoginFormWrapper>
            <Form formFields={formFields} onChange={handleFormChange} values={formValues} formErrors={errorMessage} />
            <Button
                variant='contained'
                onClick={handleSubmit}
                disabled={password.length === 0 || username.length === 0}
            >
                Submit
            </Button>
        </LoginFormWrapper>
    )
}

export default Login

const LoginFormWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: theme.spacing(2),
    margin: 'auto',
}))

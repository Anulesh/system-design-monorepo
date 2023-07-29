import * as React from 'react'
import { Alert, AlertProps } from '@mui/material'

export interface ErrorAlertProps {
    /** A string or an array of strings that represent the error. */
    errors: string | string[]
    /** Optional. Will be rendered before the actual error(s). */
    label?: string
}

/**
 * Renders an Alert that lists the given errors.
 *
 * A label can be provided which will be rendered before the error(s).
 *
 * All alert-props will be passed through to the underlying Alert component,
 * while the variant defaults to 'filled' and the severity to 'error'.
 */
export const ErrorAlert: React.FunctionComponent<ErrorAlertProps & AlertProps> = (props) => {
    const {
        // ErrorAlertProps
        errors,
        label,
        // AlertProps
        action,
        classes,
        closeText,
        color,
        components,
        componentsProps,
        icon,
        iconMapping,
        onClose,
        role,
        severity = 'error',
        slotProps,
        slots,
        sx,
        variant = 'filled',
    } = props
    return (
        <Alert
            action={action}
            classes={classes}
            closeText={closeText}
            color={color}
            components={components}
            componentsProps={componentsProps}
            icon={icon}
            iconMapping={iconMapping}
            onClose={onClose}
            role={role}
            severity={severity}
            slotProps={slotProps}
            slots={slots}
            sx={sx}
            variant={variant}
        >
            {label ? `${label}:` : ''}
            {Array.isArray(errors) ? (
                <ul>
                    {errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                    ))}
                </ul>
            ) : (
                errors
            )}
        </Alert>
    )
}

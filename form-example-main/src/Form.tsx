import { Alert, Rating, RatingProps, Stack, TextField, TextFieldProps } from '@mui/material'
import * as React from 'react'
import produce from 'immer'

import type { FormErrors, FormFieldDefinition, FormValue, FormValues } from './interfaces'
import { ErrorAlert } from './ErrorAlert'

export interface FormProps {
    /**
     * An object mapping field keys to the value of the corresponding field.
     */
    values: FormValues
    /**
     * Is called when the form commits changes to the form fields.
     *
     * The passed value is either an updater that returns the new form values
     * object or the new form values object itself.
     */
    onChange: React.Dispatch<React.SetStateAction<FormValues>>
    /**
     * An array of form field definitions.
     *
     * The order fo the definitions determines the order of the fields on the
     * form.
     */
    formFields: FormFieldDefinition[]
    /**
     * Erorrs that should be displayed on this form.
     *
     * There can be field errors or non-field errors. The former are displayed
     * on the corresponding input, the latter will be displayed in an alert
     * above the form.
     */
    formErrors?: FormErrors
}

/**
 * Renders a list of form fields based on the provided form field definitions
 * and wires the fields up to display the given values and report back
 * changes.
 *
 * If provided, errors will be rendered on top of the form or on the fields
 * directly if applicable.
 */
export const Form: React.FunctionComponent<FormProps> = (props) => {
    const { formErrors, formFields, onChange, values } = props

    const errorAlerts = React.useMemo(() => {
        if (!formErrors || !formErrors.non_field_errors) {
            return null
        }
        if (Array.isArray(formErrors.non_field_errors)) {
            return formErrors.non_field_errors.map((err, idx) => <ErrorAlert key={`error-${idx}`} errors={err} />)
        }
        return <ErrorAlert errors={formErrors.non_field_errors} />
    }, [formErrors])

    const formInputs = React.useMemo(
        () =>
            formFields.map((formField) => (
                <MemoRenderFormField
                    formField={formField}
                    value={values[formField.key] ?? ''}
                    onChange={(value: FormValue) =>
                        onChange(
                            produce((draft) => {
                                draft[formField.key] = value
                            })
                        )
                    }
                    fieldErrors={
                        formErrors && typeof formErrors[formField.key] !== 'undefined'
                            ? formErrors[formField.key]
                            : undefined
                    }
                />
            )),
        [formErrors, formFields, onChange, values]
    )

    return (
        <Stack spacing={2} data-testid={'form'}>
            {errorAlerts}
            {formInputs}
        </Stack>
    )
}

export default Form

/**
 * Redners a single form field based on the given form field definition,
 * passes it the given value, onChange, and errors, and returns the result.
 *
 * If a unknown field type is specified, an alert will be rendered instead.
 *
 * @param formField The form field definition object. This must contain the
 * field type and key and all props required for the given field type.
 * @param value The current value of the field. This will be simply passed
 * down to the field.
 * @param onChange The on change callback that will be called with the change
 * event as its only argument.
 * @param fieldErrors Optional. A string or list of string that will be passed
 * down to the field component as `helpText`. If this is defined, the field's
 * error will be set.
 * @returns A rendered form field.
 */
const MemoRenderFormField = React.memo(function renderFormField({
    formField,
    value,
    onChange,
    fieldErrors,
}: {
    formField: FormFieldDefinition
    value: FormValue
    onChange: (value: FormValue) => void
    fieldErrors?: string | string[]
}): JSX.Element {
    switch (formField.type) {
        case 'text': {
            const fieldProps = getTextFieldProps({
                formField,
                value,
                onChange,
                fieldErrors,
            })
            return <TextField key={formField.key} {...fieldProps} />
        }
        case 'password': {
            const fieldProps = getTextFieldProps({
                formField,
                value,
                onChange,
                fieldErrors,
            })
            fieldProps.type = 'password'
            return <TextField key={formField.key} {...fieldProps} />
        }
        case 'number': {
            const fieldProps = getNumberProps({
                value: value ?? '',
                formField,
                onChange,
                fieldErrors,
            })
            return <TextField key={formField.key} {...fieldProps} />
        }
        case 'rating': {
            const fieldProps = getRatingProps({
                formField,
                value: value as number | null,
                onChange,
            })
            return <Rating key={formField.key} {...fieldProps} />
        }

        default:
            return (
                <Alert
                    key={formField.key}
                    severity='error'
                    variant='outlined'
                >{`Unknown field type: "${formField.type}"`}</Alert>
            )
    }
})

/**
 * Derives and returns the props for MUI TextField from the given arguments.
 * @param formField The form field definition object. This must contain the
 * field type and key and all props required for the given field type.
 * @param value The current value of the field. This will be simply passed
 * down to the field.
 * @param onChange The on change callback that will be called with the change
 * event as its only argument.
 * @param fieldErrors Optional. A string or list of string that will be passed
 * down to the field component as `helpText`. If this is defined, the field's
 * error will be set.
 * @returns The props object appropriate for a MUI TextField component.
 */
function getTextFieldProps({
    formField,
    value,
    onChange,
    fieldErrors,
}: {
    formField: FormFieldDefinition
    value: FormValue
    onChange: (value: FormValue) => void
    fieldErrors?: string | string[]
}): TextFieldProps {
    const fieldProps: TextFieldProps = {
        id: formField.key,
        label: formField.label,
        type: 'text',
        value,
        onChange: (ev) => {
            onChange(ev.target.value ?? null)
        },
    }
    if (formField.disabled) {
        fieldProps.disabled = true
    }
    if (formField.required) {
        fieldProps.required = true
    }
    if (formField.readOnly) {
        fieldProps.InputProps = { readOnly: true }
    }
    if (fieldErrors) {
        fieldProps.error = true
        fieldProps.helperText = Array.isArray(fieldErrors) ? fieldErrors.join(' ') : fieldErrors
    }

    return fieldProps
}

/**
 * Derives and returns the props for MUI TextField from the given arguments.
 * This field only allows the usre to input positive integers.
 *
 * @param formField The form field definition object. This must contain the
 * field type and key and all props required for the given field type.
 * @param value The current value of the field. This will be simply passed
 * down to the field.
 * @param onChange The on change callback that will be called with the change
 * event as its only argument.
 * @param fieldErrors Optional. A string or list of string that will be passed
 * down to the field component as `helpText`. If this is defined, the field's
 * error will be set.
 * @returns The props object appropriate for a MUI TextField component.
 */
function getNumberProps({
    formField,
    value,
    onChange,
    fieldErrors,
}: {
    formField: FormFieldDefinition
    value: FormValue
    onChange: (value: FormValue) => void
    fieldErrors?: string | string[]
}): TextFieldProps {
    const fieldProps: TextFieldProps = {
        id: formField.key,
        label: formField.label,
        value,
        onChange: (ev) => {
            const rawValue = ev.target.value ?? null
            if (rawValue === null || rawValue === '') {
                onChange(null)
            } else {
                try {
                    const numberValue = parseInt(rawValue.replace('-', ''))
                    onChange(Number.isNaN(numberValue) ? null : numberValue)
                } catch (e) {
                    // TODO: We need to tell the user to just use digits.
                }
            }
        },
    }
    if (formField.disabled) {
        fieldProps.disabled = true
    }
    if (formField.required) {
        fieldProps.required = true
    }
    if (formField.readOnly) {
        fieldProps.InputProps = { readOnly: true }
    }
    if (fieldErrors) {
        fieldProps.error = true
        fieldProps.helperText = Array.isArray(fieldErrors) ? fieldErrors.join(' ') : fieldErrors
    }

    return fieldProps
}

/**
 * Derives and returns the props for MUI Rating component from the given arguments.
 * @param formField The form field definition object. This must contain the
 * field type and key and all props required for the given field type.
 * @param value The current value of the field. This will be simply passed
 * down to the field.
 * @param onChange The on change callback that will be called with the change
 * event as its only argument.
 * @returns The props object appropriate for a MUI Rating component.
 */
function getRatingProps({
    formField,
    value,
    onChange,
}: {
    formField: FormFieldDefinition
    value: number | null
    onChange: (value: FormValue) => void
    fieldErrors?: string | string[]
}): RatingProps {
    const fieldProps: RatingProps = {
        id: formField.key,
        emptyLabelText: formField.required ? `${formField.label} *` : formField.label,
        value,
        onChange: (ev, value) => {
            onChange(value ?? null)
        },
    }
    if (formField.disabled) {
        fieldProps.disabled = true
    }
    if (formField.readOnly) {
        fieldProps.readOnly = true
    }
    if ((formField as any).upperBound) {
        fieldProps.max = (formField as any).upperBound
    }

    return fieldProps
}

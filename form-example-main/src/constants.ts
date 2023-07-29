import { FormFieldDefinition } from './interfaces'

/** The field definitions for the login form. */
export const LOGIN_FORM_FIELD_DEFINITIONS = {
    username: {
        key: 'username',
        label: 'Username',
        type: 'text',
        required: true,
        autoComplete: 'current-username',
    },
    password: {
        key: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        autoComplete: 'current-password',
    },
} as { [fieldKey: string]: FormFieldDefinition }

/** The field definitions for the instance form. */
export const INSTANCE_FORM_FIELD_DEFINITIONS = {
    firstName: {
        key: 'firstName',
        label: 'First name',
        type: 'text',
        required: true,
    },
    lastName: {
        key: 'lastName',
        label: 'Last name',
        type: 'text',
        required: true,
    },
    age: {
        key: 'age',
        label: 'Age',
        type: 'number',
        required: true,
        lowerBound: 0,
    },
    rating: {
        key: 'rating',
        label: 'Rating',
        type: 'rating',
        required: true,
        lowerBound: 1,
        upperBound: 5,
    },
} as { [fieldKey: string]: FormFieldDefinition }

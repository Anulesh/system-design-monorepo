/**
 * An object that maps field keys to arrays of strings or single strings.
 *
 * Each string represents an error for the corresponding field.
 *
 * "non_field_errors" can be used to list error messages that do not apply to
 * one particular field.
 */
export interface FormErrors {
    [fieldKey: string]: string | string[]
}

/** An example for a person instance. */
export interface Instance {
    id: number
    firstName: string
    lastName: string
    age: number
    rating: number
}

/** An object that maps instance IDs to instances. */
export interface Instances {
    [id: string]: Instance
}

/** A partial instance object that does not contain the instance's ID. */
export type InstanceChanges = Partial<Omit<Instance, 'id'>>

/**
 * An object that maps instance IDs to partial instances that represent the
 * changed fields of the corresponding instance.
 */
export interface InstancesChanges {
    [id: string]: InstanceChanges
}

export interface Response {
    status: number
    statusText: string
    data?: Instance[] | Instance | FormErrors
}

export interface InstanceResponse extends Response {
    data: Instance | FormErrors
}

export interface InstancesResponse extends Response {
    data: Instance[]
}

export enum REQUEST_METHOD {
    GET = 'get',
    POST = 'post',
    PATCH = 'patch',
    DELETE = 'delete',
}

export interface RequestPayload {
    [key: string]: boolean | number | string
}

export interface InstanceRequestsActionPayload {
    id: number
    requestMethod: REQUEST_METHOD
    payload?: InstanceChanges
}

export interface RequestState {
    state: 'pending' | 'fulfilled' | 'rejected'
    response?: Response
}

export interface InstanceRequestStates {
    get?: RequestState
    patch?: RequestState
    delete?: RequestState
}

export interface ListRequestStates {
    get?: RequestState
    post?: RequestState
}

export interface InstanceRequestsState {
    instance: {
        [instanceId: string]: InstanceRequestStates
    }
    list: ListRequestStates
}

/** The value type of form fields. */
export type FormValue = null | boolean | number | string

/** The value object of a form. */
export interface FormValues {
    [fieldKey: string]: FormValue
}

/**
 * The basic information needed to select the appropriate form field type to
 * render.
 */
export interface FormFieldDefinition {
    /**
     * Determines the type of input that will be rendered and the props that
     * will be required.
     */
    type: 'switch' | 'number' | 'text' | 'password' | 'rating'
    /**
     * A string that is unique among all field definition of this form.
     *
     * This will be used to communicate value changes of the corresponding
     * input.
     */
    key: string
    /** The label of the input field. */
    label: string
    /**
     * Signifies whether this field is required. If set to true, an asterisk
     * will be added to the field's label.
     *
     * Defaults to `false`.
     */
    required?: boolean
    /**
     * Signifies whether this field is read-only.
     *
     * Read-only means that the field will look enabled but can't be changed
     * by the user.
     *
     * Defaults to `false`.
     */
    readOnly?: boolean
    /**
     * Signifies whether this field is disabled.
     *
     * In contrast to read-only, a disabled field will change visually to
     * signify that the user can't interact with it.
     *
     * Defaults to `false`.
     */
    disabled?: boolean
    /**
     * An optional autocomplete identifier.
     *
     * This can be used by the browser to auto fill in a field.
     */
    autoComplete?: string
}

/**
 * Indicates the status of an instance in regards to requests regarding it.
 */
export enum InstanceEndpointStatus {
    /** There is a pending DELETE request related to the instance. */
    DELETING = 'deleting',
    /** There is a fulfilled DELETE request related to the instance. */
    DELETED = 'deleted',
    /** One of the requests associated with the instance has been rejected. */
    ERROR = 'error',
    /** There is no data yet. */
    FETCHING = 'fetching',
    /** There is data and no request related to the instance is pending. */
    READY = 'ready',
    /** There is a pending PATCH request related to the instance. */
    SAVING = 'saving',
    /** There is data and a pending GET request related to the instance. */
    UPDATING = 'updating',
}

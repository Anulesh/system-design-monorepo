import type { FormErrors, Instance, InstanceResponse, Instances, Response } from './interfaces'

const REQUEST_DELAY = 200

export const serverState = {
    1: {
        id: 1,
        firstName: 'Roslaynne',
        lastName: 'Boone',
        age: 35,
        rating: 2,
    },
    2: {
        id: 2,
        firstName: 'Coty',
        lastName: 'Chrysanta',
        age: 30,
        rating: 3,
    },
    3: {
        id: 3,
        firstName: 'Isabella',
        lastName: 'Faron',
        age: 40,
        rating: 5,
    },
    4: {
        id: 4,
        firstName: 'Cleveland',
        lastName: 'Reynard',
        age: 22,
        rating: 1,
    },
    5: {
        id: 5,
        firstName: 'Andrew',
        lastName: 'Osmond',
        age: 29,
        rating: 4,
    },
} as Instances

export const ServerCommunicator = {
    get: (instanceId?: number): Promise<Response> => {
        return delay<Response>((resolve, reject) => {
            if (instanceId && typeof serverState[instanceId] === 'undefined') {
                reject(get404Response(instanceId))
            } else if (typeof instanceId === 'number') {
                resolve({
                    status: 200,
                    statusText: 'Ok',
                    data: { ...serverState[instanceId] },
                })
            } else {
                const data = Object.values<Instance>(serverState).map((value) => ({ ...value }))
                data.sort(({ id: idA }, { id: idB }) => idA - idB)
                resolve({
                    status: 200,
                    statusText: 'Ok',
                    data,
                })
            }
        })
    },
    post: (newInstance: Omit<Instance, 'id'>): Promise<InstanceResponse> => {
        return delay<InstanceResponse>((resolve, reject) => {
            const validationResult = validateInstance(newInstance)
            if (validationResult !== null) {
                reject({
                    status: 400,
                    statusText: 'Bad Request',
                    data: validationResult,
                })
            } else {
                const id = Math.max(...Object.values(serverState).map((instance) => instance.id)) + 1
                const instance = {
                    id,
                    ...newInstance,
                }
                serverState[id] = instance
                resolve({
                    status: 201,
                    statusText: 'Created',
                    data: instance,
                })
            }
        })
    },
    patch: (instanceId: number, data: Partial<Omit<Instance, 'id'>>): Promise<InstanceResponse> => {
        return delay<InstanceResponse>((resolve, reject) => {
            if (instanceId && typeof serverState[instanceId] === 'undefined') {
                reject(get404Response(instanceId))
                return
            }
            const instance = {
                ...serverState[instanceId],
                ...data,
            }
            const validationResult = validateInstance(instance)
            if (validationResult !== null) {
                reject({
                    status: 400,
                    statusText: 'Bad Request',
                    data: validationResult,
                })
            } else {
                serverState[instanceId] = instance
                resolve({
                    status: 200,
                    statusText: 'Ok',
                    data: instance,
                })
            }
        })
    },
    delete: (instanceId: number): Promise<Response> => {
        return delay<Response>((resolve, reject) => {
            if (typeof serverState[instanceId] === 'undefined') {
                reject(get404Response(instanceId))
            } else {
                delete serverState[instanceId]
                resolve({
                    status: 204,
                    statusText: 'No Content',
                })
            }
        })
    },
}

function delay<T>(task: (resolve: (value: T) => void, reject: (value: T) => void) => void): Promise<T> {
    return new Promise((resolve, reject) => {
        window.setTimeout(() => {
            task(resolve, reject)
        }, REQUEST_DELAY)
    })
}

/**
 * Creates and returns the instance request repsonse object containing the
 * appropriate response for a 404 Not Found error.
 *
 * @param instanceId The ID of the instance that couldn't be found.
 * @returns A Response object with the appropriate status and form error
 * object.
 */
function get404Response(instanceId: number): InstanceResponse {
    return {
        status: 404,
        statusText: 'Not Found',
        data: {
            non_field_errors: [`There is no instance with ID=${instanceId}!`],
        },
    }
}

/**
 * Validates all properties except for the ID of the given instance object
 * and returns the result of the validation.
 *
 * @param instance The instance that should be validated.
 * @returns `Null` if there si no validation error, an object mapping the
 * instance's property to the appropriate error message.
 */
export function validateInstance(instance: Partial<Instance>): null | FormErrors {
    const errors = {} as FormErrors

    const firstNameValidation = validateRequiredStringType(instance.firstName, 'First name')
    if (firstNameValidation !== null) {
        errors.firstName = firstNameValidation
    }

    const lastNameValidation = validateRequiredStringType(instance.lastName, 'Last name')
    if (lastNameValidation !== null) {
        errors.lastName = lastNameValidation
    }

    const ageValidation = validateOptionalNumberType(instance.age, 'Age', 0)
    if (ageValidation !== null) {
        errors.age = ageValidation
    }

    const ratingValidation = validateOptionalNumberType(instance.rating, 'Rating', 1, 5)
    if (ratingValidation !== null) {
        errors.rating = ratingValidation
    }

    return Object.keys(errors).length === 0 ? null : errors
}

/**
 * Checks whetehr `arg` is a non-empty string and returns either `null` if
 * the validation went through or an error message.
 *
 * @param arg The argument that should be validated.
 * @param propName The string used in the error message to refer to the given
 * argument.
 * @returns Either `null` if there is no error or a string representing the
 * error message.
 */
export function validateRequiredStringType(arg: unknown, propName: string): null | string {
    if (arg === null || typeof arg === 'undefined' || (typeof arg === 'string' && arg.length === 0)) {
        return `${propName} is required!`
    } else if (typeof arg !== 'string') {
        return `${propName} must be a string!`
    }
    return null
}

/**
 * Checks whetehr `arg` is a null, undefined, or a number and returns either
 * `null` if the validation went through or an error message.
 *
 * @param arg The argument that should be validated.
 * @param propName The string used in the error message to refer to the given
 * argument.
 * @param lowerBound Optional. If set, the given arg must be a number equal to
 * or above this value if the argument is a number.
 * @param upperBound Optional. If set, the given arg must be a number equal to
 * or below this value if the argument is a number.
 * @returns Either `null` if there is no error or a string representing the
 * error message.
 */
export function validateOptionalNumberType(
    arg: unknown,
    propName: string,
    lowerBound?: number,
    upperBound?: number
): null | string {
    if (arg !== null && typeof arg !== 'undefined' && typeof arg !== 'number') {
        return `${propName} must be a number!`
    }
    if (typeof lowerBound === 'number' && typeof arg === 'number' && arg < lowerBound) {
        return `${propName} must be ${
            typeof upperBound === 'number' ? `between ${lowerBound} and ${upperBound}` : `${lowerBound} or above`
        }!`
    }
    if (typeof upperBound === 'number' && typeof arg === 'number' && arg > upperBound) {
        return `${propName} must be ${
            typeof lowerBound === 'number' ? `between ${lowerBound} and ${upperBound}` : `${upperBound} or below`
        }!`
    }
    return null
}

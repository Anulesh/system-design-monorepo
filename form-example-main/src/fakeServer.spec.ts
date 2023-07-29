import { serverState, ServerCommunicator, validateRequiredStringType, validateOptionalNumberType } from './fakeServer'

import type { Instance } from './interfaces'

describe('fakeServer', () => {
    describe('ServerCommunicator', () => {
        it('.get(): 200 response; contains the complete server state', async () => {
            const expectedResponse = Object.values<Instance>(serverState)
            expectedResponse.sort(({ id: idA }, { id: idB }) => idA - idB)
            const response = await ServerCommunicator.get()
            expect(response.status).toBe(200)
            expect(response.statusText).toBe('Ok')
            expect(response.data).toEqual(expectedResponse)
        })

        it('.get(id): 200 response; contains one instance', async () => {
            const instanceId = parseInt(Object.keys(serverState)[0])
            const response = await ServerCommunicator.get(instanceId)
            expect(response.status).toBe(200)
            expect(response.statusText).toBe('Ok')
            expect(response.data).toEqual(serverState[instanceId])
        })

        it('.get(invalidId): 404 response; contains non_field_errors', async () => {
            const invalidInstanceId = Math.max(...Object.keys(serverState).map((idStr) => parseInt(idStr))) + 1
            const response = await ServerCommunicator.get(invalidInstanceId).catch((response) => response)
            expect(response.status).toBe(404)
            expect(response.statusText).toBe('Not Found')
            expect(response.data).toEqual({
                non_field_errors: [`There is no instance with ID=${invalidInstanceId}!`],
            })
        })

        it('.post(newInstance): 201 response; contains the new instance', async () => {
            const newInstance: Omit<Instance, 'id'> = {
                firstName: 'Foo',
                lastName: 'Bar',
                age: 123,
                rating: 1,
            }
            const response = await ServerCommunicator.post(newInstance)
            expect(response.status).toBe(201)
            expect(response.statusText).toBe('Created')
            expect(response.data).toEqual({
                id: response.data.id,
                ...newInstance,
            })
        })

        it('.post(invalidInstance): 400 repsonse; contains errors', async () => {
            const instance: Omit<Instance, 'id'> = {
                firstName: 'Foo',
                lastName: 'Bar',
                age: 123,
                rating: 1,
            }
            const invalidFirstName = {
                ...instance,
                firstName: '',
            }
            const invalidFirstNameResponse = await ServerCommunicator.post(invalidFirstName).catch(
                (response) => response
            )
            expect(invalidFirstNameResponse.status).toBe(400)
            expect(invalidFirstNameResponse.statusText).toBe('Bad Request')
            expect(invalidFirstNameResponse.data).toEqual({
                firstName: 'First name is required!',
            })

            const invalidLastName = {
                ...instance,
                lastName: '',
            }
            const invalidLastNameResponse = await ServerCommunicator.post(invalidLastName).catch((response) => response)
            expect(invalidLastNameResponse.status).toBe(400)
            expect(invalidLastNameResponse.statusText).toBe('Bad Request')
            expect(invalidLastNameResponse.data).toEqual({
                lastName: 'Last name is required!',
            })

            const invalidAge = {
                ...instance,
                age: -1,
            }
            const invalidAgeResponse = await ServerCommunicator.post(invalidAge).catch((response) => response)
            expect(invalidAgeResponse.status).toBe(400)
            expect(invalidAgeResponse.statusText).toBe('Bad Request')
            expect(invalidAgeResponse.data).toEqual({
                age: 'Age must be 0 or above!',
            })

            const invalidRating = {
                ...instance,
                rating: 0,
            }
            const invalidRatingResponse = await ServerCommunicator.post(invalidRating).catch((response) => response)
            expect(invalidRatingResponse.status).toBe(400)
            expect(invalidRatingResponse.statusText).toBe('Bad Request')
            expect(invalidRatingResponse.data).toEqual({
                rating: 'Rating must be between 1 and 5!',
            })
        })

        it('.patch(id, data): 200 response; contains the updated instance', async () => {
            const instanceId = 1
            const instancePatch = {
                firstName: 'Foo',
                lastName: 'Bar',
            }
            const response = await ServerCommunicator.patch(instanceId, instancePatch)
            expect(response.status).toBe(200)
            expect(response.statusText).toBe('Ok')
            expect(response.data).toEqual({
                ...serverState[instanceId],
                ...instancePatch,
            })
        })

        it('.patch(id, data): 400 repsonse; contains errors', async () => {
            const instanceId = 1
            const invalidFirstNamePatch = {
                firstName: '',
            }
            const invalidFirstNameResponse = await ServerCommunicator.patch(instanceId, invalidFirstNamePatch).catch(
                (response) => response
            )
            expect(invalidFirstNameResponse.status).toBe(400)
            expect(invalidFirstNameResponse.statusText).toBe('Bad Request')
            expect(invalidFirstNameResponse.data).toEqual({
                firstName: 'First name is required!',
            })

            const invalidLastNamePatch = {
                lastName: '',
            }
            const invalidLastNameResponse = await ServerCommunicator.patch(instanceId, invalidLastNamePatch).catch(
                (response) => response
            )
            expect(invalidLastNameResponse.status).toBe(400)
            expect(invalidLastNameResponse.statusText).toBe('Bad Request')
            expect(invalidLastNameResponse.data).toEqual({
                lastName: 'Last name is required!',
            })

            const invalidAgePatch = {
                age: -1,
            }
            const invalidAgeResponse = await ServerCommunicator.patch(instanceId, invalidAgePatch).catch(
                (response) => response
            )
            expect(invalidAgeResponse.status).toBe(400)
            expect(invalidAgeResponse.statusText).toBe('Bad Request')
            expect(invalidAgeResponse.data).toEqual({
                age: 'Age must be 0 or above!',
            })

            const invalidRatingPatch = {
                rating: 0,
            }
            const invalidRatingResponse = await ServerCommunicator.patch(instanceId, invalidRatingPatch).catch(
                (response) => response
            )
            expect(invalidRatingResponse.status).toBe(400)
            expect(invalidRatingResponse.statusText).toBe('Bad Request')
            expect(invalidRatingResponse.data).toEqual({
                rating: 'Rating must be between 1 and 5!',
            })
        })

        it('.patch(invalidId): 404 response; contains non_field_errors', async () => {
            const invalidInstanceId = Math.max(...Object.keys(serverState).map((idStr) => parseInt(idStr))) + 1
            const response = await ServerCommunicator.patch(invalidInstanceId, {}).catch((response) => response)
            expect(response.status).toBe(404)
            expect(response.statusText).toBe('Not Found')
            expect(response.data).toEqual({
                non_field_errors: [`There is no instance with ID=${invalidInstanceId}!`],
            })
        })

        it('.delete(id): 204 response; contains no data', async () => {
            const instanceId = parseInt(Object.keys(serverState)[0])
            const response = await ServerCommunicator.delete(instanceId)
            expect(response.status).toBe(204)
            expect(response.statusText).toBe('No Content')
            expect(typeof response.data === 'undefined').toBe(true)
        })

        it('.delete(invalidId): 404 response; contains non_field_errors', async () => {
            const invalidInstanceId = Math.max(...Object.keys(serverState).map((idStr) => parseInt(idStr))) + 1
            const response = await ServerCommunicator.delete(invalidInstanceId).catch((response) => response)
            expect(response.status).toBe(404)
            expect(response.statusText).toBe('Not Found')
            expect(response.data).toEqual({
                non_field_errors: [`There is no instance with ID=${invalidInstanceId}!`],
            })
        })
    })

    describe('validateRequiredStringType', () => {
        it('Empty string returns an error message', () => {
            const propName = 'Foobar'
            const argNull = null
            expect(validateRequiredStringType(argNull, propName)).toEqual(`${propName} is required!`)
            const argUndefined = undefined
            expect(validateRequiredStringType(argUndefined, propName)).toEqual(`${propName} is required!`)
            const argEmpty = ''
            expect(validateRequiredStringType(argEmpty, propName)).toEqual(`${propName} is required!`)
        })

        it('Non-string-type returns an error message', () => {
            const propName = 'Foobar'
            const arg = 0
            expect(validateRequiredStringType(arg, propName)).toEqual(`${propName} must be a string!`)
        })

        it('Non-empty string-type returns no error message', () => {
            const propName = 'Foobar'
            const arg = 'foobar'
            expect(validateRequiredStringType(arg, propName)).toEqual(null)
        })
    })

    describe('validateOptionalNumberType', () => {
        it('Non-number-type returns an error message', () => {
            const propName = 'Foobar'
            const arg = '0'
            expect(validateOptionalNumberType(arg, propName)).toEqual(`${propName} must be a number!`)
        })

        it('number below lower bound returns an error message', () => {
            const propName = 'Foobar'
            const arg = 0
            const lowerBound = 1
            expect(validateOptionalNumberType(arg, propName, lowerBound)).toEqual(
                `${propName} must be ${lowerBound} or above!`
            )
        })

        it('number above upper bound returns an error message', () => {
            const propName = 'Foobar'
            const arg = 2
            const upperBound = 1
            expect(validateOptionalNumberType(arg, propName, undefined, upperBound)).toEqual(
                `${propName} must be ${upperBound} or below!`
            )
        })

        it('number outside range returns an error message', () => {
            const propName = 'Foobar'
            const argBelow = -1
            const argAbove = 2
            const lowerBound = 0
            const upperBound = 1
            expect(validateOptionalNumberType(argBelow, propName, lowerBound, upperBound)).toEqual(
                `${propName} must be between ${lowerBound} and ${upperBound}!`
            )
            expect(validateOptionalNumberType(argAbove, propName, lowerBound, upperBound)).toEqual(
                `${propName} must be between ${lowerBound} and ${upperBound}!`
            )
        })
    })
})

import 'jest'
import * as request from 'supertest'

let address: string = (<any>global).address

test('get /users', () => {
    return request(address)
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        })
        .catch(fail)
})

test('post /users', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'Andressa',
            email: 'andressa@gmail.com',
            password: '123456',
            cpf: '693.154.470-50'
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('Andressa')
            expect(response.body.email).toBe('andressa@gmail.com')
            expect(response.body.cpf).toBe('693.154.470-50')
            expect(response.body.password).toBeUndefined()
        })
        .catch(fail)
})

test('get /users/aaaaa - not found', () => {
    return request(address)
        .get('/users/aaaaa')
        .then(response => {
            expect(response.status).toBe(404)
        })
        .catch(fail)
})

test('patch /users/:id', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'Bernardo',
            email: 'bernardo@gmail.com',
            password: '123456'
        })
        .then(response => {
            return request(address)
                .patch(`/users/${response.body._id}`)
                .send({
                    name: 'Bernardo da Silva'
                })
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('Bernardo da Silva')
            expect(response.body.email).toBe('bernardo@gmail.com')
            expect(response.body.password).toBeUndefined()
        })
        .catch(fail)
})
const request = require('supertest')
const createApp = require('../src/app')
const { models } = require('../src/db/sequelize')
const {upSeed, downSeed} = require('./utils/seed')

//Arrange - previo
//Act - ejecutar
//Assert - comprobar

describe('Tests for /users path', () => {

    let app = null
    let server = null
    let api = null

    beforeAll(async() => {
        app = createApp()
        server = app.listen(9000)
        api = request(app)

        await upSeed()
    })

    describe('GET /users/{id}', () => {
        test('sould return a user', async() => {
            const user = await models.User.findByPk('1')
            const inputID = '1'
            const {statusCode, body} = await api.get(`/api/v1/users/${inputID}`)

            expect(statusCode).toEqual(200)
            expect(body.id).toEqual(user.id)
            expect(body.email).toEqual(user.email)

        })
    })

    describe('POST /users', () => {
        test('should return a 400 Bad request with invalid password', async() => {
            const inputData = {
                email: "jhon@mail.com",
                password: "-----"
            }

            const response = await api.post('/api/v1/users').send(inputData)

            expect(response.statusCode).toEqual(400)
            expect(response.body.message).toMatch('password')
        })

        test('should return a 400 Bad request with invalid email', async() => {
            const inputData = {
                email: "----",
                password: "password1234"
            }

            //usando destructuring del response
            const {statusCode, body} = await api.post('/api/v1/users').send(inputData)

            expect(statusCode).toEqual(400)
            expect(body.message).toMatch('email')
        })

        test('should return a new user', async() => {
            const inputData = {
                email: "jhon@mail.com",
                password: "password1234"
            }

            const {statusCode, body} = await api.post('/api/v1/users').send(inputData)

            expect(statusCode).toEqual(201)
            //check with db

            const user = await models.User.findByPk(`${body.id}`)
            expect(user).toBeDefined()
            expect(user.email).toEqual(inputData.email)
            expect(user.password).not.toEqual(inputData.password)
            expect(user.role).toEqual('admin')
        })

    })

    describe('PUT /users', () => {
        //tests for /users
    })

    afterAll(async() => {
        await downSeed()
        server.close()
    })
})
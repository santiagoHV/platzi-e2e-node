const request = require('supertest')
const createApp = require('../src/app')
const { models } = require('../src/db/sequelize')
const { upSeed, downSeed } = require('./utils/umzug')


describe('Tests for /categories path', () => {

    let app = null
    let server = null
    let api = null

    beforeAll(async() => {
        app = createApp()
        server = app.listen(9000)
        api = request(app)

        await upSeed()
    })

    describe('POST /categories with admin user', () => {
        beforeAll(async() => {
            const user = await models.User.findByPk('1')
            const inputData = {
                email: user.email,
                password: '123456' //TODO: refactor en semillas
            }

            const { body } = await api.post('/api/v1/auth/login').send(inputData)
            accessToken = body.access_token
        })

        test('should return 401 with no token', async() => {
            const inputData = {
                name: 'Categoria nueva',
                image: 'https://www.google.com'
            }

            const { statusCode } = await api.post('/api/v1/categories').send(inputData)

            expect(statusCode).toEqual(401)
        })

        test('should return a new category with valid token', async() => {
            const inputData = {
                name: 'Categoria nueva',
                image: 'https://www.google.com'
            }

            const { statusCode, body } = await api.post('/api/v1/categories')
                .send(inputData)
                .set({
                    'Authorization': `Bearer ${accessToken}`
                })

            expect(statusCode).toEqual(201)

            const category = await models.Category.findByPk(body.id)

            expect(category.name).toEqual(inputData.name)
            expect(category.image).toEqual(inputData.image)

        })

        afterAll(async() => {
            accessToken = null
        })
    })

    describe('POST /categories with costumer user', () => {
        beforeAll(async() => {
            const user = await models.User.findByPk('2')
            const inputData = {
                email: user.email,
                password: '123456' //TODO: refactor en semillas
            }

            const { body } = await api.post('/api/v1/auth/login').send(inputData)
            accessToken = body.access_token
        })

        test('should return 401 with no token', async() => {
            const inputData = {
                name: 'Categoria nueva',
                image: 'https://www.google.com'
            }

            const { statusCode } = await api.post('/api/v1/categories').send(inputData)

            expect(statusCode).toEqual(401)
        })

        test('should return 401 with costumer token', async() => {
            const inputData = {
                name: 'Categoria nueva',
                image: 'https://www.google.com'
            }

            const { statusCode, body } = await api.post('/api/v1/categories')
                .send(inputData)
                .set({
                    'Authorization': `Bearer ${accessToken}`
                })

            expect(statusCode).toEqual(401)
        })

        afterAll(async() => {
            accessToken = null
        })
    })


    afterAll(async() => {
        await downSeed()
        server.close()
    })
})
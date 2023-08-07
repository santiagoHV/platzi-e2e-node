const request = require('supertest')
const createApp = require('../src/app')
const { models } = require('../src/db/sequelize')


describe('Tests for /auth path', () => {

    let app = null
    let server = null
    let api = null

    beforeAll(() => {
        app = createApp()
        server = app.listen(9000)
        api = request(app)
    })

    describe('POST /login', () => {
        test('should return a 401 with invalid credentials', async() => {
            const inputData = {
                email: 'emailfake@mail.com',
                password: 'passwordfake'
            }

            const {statusCode} = await api.post('/api/v1/auth/login').send(inputData)

            expect(statusCode).toEqual(401)
        })

        test('should return a 200 with valid credentials', async() => {
            const inputData = {
                email: 'admin@mail.com',
                password: 'admin123'
            }

            const {statusCode, body} = await api.post('/api/v1/auth/login').send(inputData)
            expect(statusCode).toEqual(200)
            expect(body.access_token).toBeDefined()
            expect(body.user.email).toEqual(inputData.email)
            expect(body.user.password).toBeUndefined()
        })
    })



    afterAll(() => {
        server.close()
    })
})
const request = require('supertest')
const createApp = require('../src/app')
const { models } = require('../src/db/sequelize')
const {upSeed, downSeed} = require('./utils/seed')


describe('Tests for /profile path', () => {

    let app = null
    let server = null
    let api = null

    beforeAll(async() => {
        app = createApp()
        server = app.listen(9000)
        api = request(app)

        await upSeed()
    })

    describe('GET /my-user', () => {

        beforeAll(async() => {
            const user = await models.User.findByPk('1')
            const inputData = {
                email: user.email,
                password: '123456' //TODO: refactor en semillas
            }

            const { body } = await api.post('/api/v1/auth/login').send(inputData)
            accessToken = body.access_token
        })

        test('should return a 401', async() => {
            const {statusCode} = await api.get('/api/v1/profile/my-user').set({
                'Authorization': `Bearer notoken123`
            })

            expect(statusCode).toEqual(401)
        })

        test('should return user data with valid token', async() => {
            const user = await models.User.findByPk('1')

            const {statusCode, body} = await api.get('/api/v1/profile/my-user').set({
                'Authorization': `Bearer ${accessToken}`
            })

            expect(statusCode).toEqual(200)
            expect(body.email).toEqual(user.email)
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
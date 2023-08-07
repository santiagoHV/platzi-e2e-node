const request = require('supertest')
const createApp = require('../src/app')
const { config } = require('../src/config/config')

describe('Tests for app', () => {

    let app = null
    let server = null
    let api = null

    beforeAll(() => {
        app = createApp()
        server = app.listen(9000)
        api = request(app)
    })

    it('should respond with a 200 status code', async() => {
        const res = await api.get('/')
        expect(res.statusCode).toEqual(200)
    })

    describe('GET /nueva-ruta', () => {

        test('should return 401 without api key', async() => {
            const {statusCode} = await api.get('/nueva-ruta')
            expect(statusCode).toEqual(401)
        })

        test('should return 401 with invalid api key', async() => {
            const {statusCode} = await api.get('/nueva-ruta').set({
                api: '123456'
            })

            expect(statusCode).toEqual(401)
        })

        test('should return 200 with valid api key', async() => {
            const {statusCode} = await api.get('/nueva-ruta').set({
                api: config.apiKey
            })

            expect(statusCode).toEqual(200)
        })

    })

    afterAll(() => {
        server.close()
    })
})
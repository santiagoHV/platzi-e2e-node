const request = require('supertest')
const createApp = require('../src/app')

describe('Tests for app', () => {

    let app = null
    let server = null
    let api = null

    beforeEach(() => {
        app = createApp()
        server = app.listen(9000)
        api = request(app)
    })

    it('should respond with a 200 status code', async() => {
        const res = await api.get('/')
        expect(res.statusCode).toEqual(200)
    })

    afterEach(() => {
        server.close()
    })
})
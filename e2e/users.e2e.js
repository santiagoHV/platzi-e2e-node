const request = require('supertest')
const createApp = require('../src/app')

//Arrange - previo
//Act - ejecutar
//Assert - comprobar

describe('Tests for /users path', () => {

    let app = null
    let server = null
    let api = null

    beforeEach(() => {
        app = createApp()
        server = app.listen(9000)
        api = request(app)
    })

    describe('GET /users', async() => {
        //tests for /users
    })

    describe('POST /users', async() => {
        test('should return a 400 Bad request', async() => {
            const inputData = {
                email: "jhon@mail.com",
                password: "-----"
            }

            const response = await api.post('/api/v1/users').send(inputData)

            expect(response.statusCode).toEqual(400)


        })
    })

    describe('PUT /users', async() => {
        //tests for /users
    })

    afterEach(() => {
        server.close()
    })
})
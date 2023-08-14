const request = require('supertest')
const createApp = require('../src/app')
const { upSeed, downSeed } = require('./utils/umzug')

const mockSendMail = jest.fn()

jest.mock('nodemailer', () => {
    return {
        createTransport: jest.fn().mockImplementation(() => {
            return {
                sendMail: mockSendMail
            }
        })
    }
})

describe('Tests for /auth path', () => {

    let app = null
    let server = null
    let api = null

    beforeAll(async() => {
        app = createApp()
        server = app.listen(9000)
        api = request(app)

        await upSeed()
    })

    describe('POST /login', () => {
        test('should return a 401 with invalid credentials', async() => {
            const inputData = {
                email: 'emailfake@mail.com',
                password: 'passwordfake'
            }

            const { statusCode } = await api.post('/api/v1/auth/login').send(inputData)

            expect(statusCode).toEqual(401)
        })

        test('should return a 200 with valid credentials', async() => {
            const inputData = {
                email: 'admin@mail.com',
                password: '123456'
            }

            const { statusCode, body } = await api.post('/api/v1/auth/login').send(inputData)
            expect(statusCode).toEqual(200)
            expect(body.access_token).toBeDefined()
            expect(body.user.email).toEqual(inputData.email)
            expect(body.user.password).toBeUndefined()
        })
    })

    describe('POST /recovery', () => {
        beforeAll(async() => {
            mockSendMail.mockClear()
        })

        test('should return a 401 with unexistant mail', async() => {
            const inputData = {
                email: 'emailfake@mail.com'
            }

            const { statusCode } = await api.post('/api/v1/auth/recovery').send(inputData)
            expect(statusCode).toEqual(401)
        })

        test('should return a 200 with valid mail', async() => {
            const inputData = {
                email: 'costumer@mail.com'
            }

            mockSendMail.mockResolvedValue(true)
            const { statusCode, body } = await api.post('/api/v1/auth/recovery').send(inputData)
            expect(statusCode).toEqual(200)
            expect(body.message).toEqual('mail sent')
            expect(mockSendMail).toHaveBeenCalled()

        })

        afterAll(async() => {
            await downSeed()
            server.close()
        })

    })
})
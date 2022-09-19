const request = require('supertest')
const app = require('../../src/app')

describe('GET invalid URL ', () => {
    test('404 is returned to invalid URL request', () => request(app).get('/invalid').expect(404))
})
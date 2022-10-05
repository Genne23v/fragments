const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  test('Unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  test('Incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('Authenticated users get a fragments array', async () => {
    await request(app)
      .get('/v1/fragments')
      .auth('test1@test.com', 'Test123$')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok'))
      .expect((res) => expect(Array.isArray(res.body.fragments)).toBe(true))
      .expect((res) => expect(res.headers['location']).not.toBeUndefined());
  });

  test('GET /v1/fragments returns 404', (done) => {
    request(app)
      .get('/fragments')
      .auth('test1@test.com', 'Test123$')
      .expect(404)
      .expect((res) => expect(res.body.status).toBe('error'))
      .end(done);
  });
});

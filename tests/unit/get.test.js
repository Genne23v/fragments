const request = require('supertest');
const app = require('../../src/app');

describe('GET v1/fragments', () => {
  test('Unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  test('Incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('Authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('test1@test.com', 'Test123$');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.headers['location']).not.toBeUndefined();
  });

  test('GET /fragments returns 404', async () => {
    const res = await request(app).get('/fragments').auth('test1@test.com', 'Test123$')
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  })
});

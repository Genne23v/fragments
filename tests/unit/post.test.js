const request = require('supertest');
const app = require('../../src/app');

describe('POST v1/fragments', () => {
  test('Unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  test('Incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('Authenticated users with valid content type get a 200 response', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test1@test.com', 'Test123$')
      .set('Content-Type', 'text/plain; charset=UTF-8')
      .send('post test');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('Authenticated users with invalid content type get a 415 response', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test1@test.com', 'Test123$')
      .set('Content-Type', 'image/png')
      .send('post test');

    expect(res.statusCode).toBe(500);
    expect(res.body.status).toBe('error');
  });
});

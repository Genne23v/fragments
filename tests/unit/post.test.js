const request = require('supertest');
const app = require('../../src/app');

describe('POST v1/fragments', () => {
  test('Unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  test('Incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('Authenticated users with valid content type get a 200 response', (done) => {
    request(app)
      .post('/v1/fragments')
      .auth('test1@test.com', 'Test123$')
      .set('Content-Type', 'text/plain; charset=utf-8')
      .send('post test')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok'))
      .expect(res => expect(res.body.fragment.type).toBe('text/plain; charset=utf-8'))
      .end(done);
  });

  test('Authenticated users with invalid content type get a 415 response', (done) => {
    request(app)
      .post('/v1/fragments')
      .auth('test1@test.com', 'Test123$')
      .set('Content-Type', 'image/png')
      .send('post test')
      .expect(415)
      .expect((res) => expect(res.body.status).toBe('error'))
      .end(done);
  });
});

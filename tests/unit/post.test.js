const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  test('Unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  test('Incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('Authenticated users with text content type get a 201 response', (done) => {
    request(app)
      .post('/v1/fragments')
      .auth('test1@test.com', 'Test123$')
      .set('Content-Type', 'text/plain; charset=utf-8')
      .send('post test')
      .expect(201)
      .expect((res) => expect(res.body.status).toBe('ok'))
      .expect((res) => expect(res.body.fragment.type).toBe('text/plain; charset=utf-8'))
      .end(done);
  });

  test('Authenticated users with markdown content type get a 201 response', (done) => {
    request(app)
      .post('/v1/fragments')
      .auth('test1@test.com', 'Test123$')
      .set('Content-Type', 'text/markdown')
      .send('post test')
      .expect(201)
      .expect((res) => expect(res.body.status).toBe('ok'))
      .expect((res) => expect(res.body.fragment.type).toBe('text/markdown'))
      .end(done);
  });

  test('Authenticated users with invalid content type get a 415 response', (done) => {
    request(app)
      .post('/v1/fragments')
      .auth('test1@test.com', 'Test123$')
      .set('Content-Type', 'application/pdf')
      .send('post test')
      .expect(415)
      .expect((res) => expect(res.body.status).toBe('error'))
      .end(done);
  });
});

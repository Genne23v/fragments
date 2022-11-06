const request = require('supertest');
const app = require('../../src/app');
const wait = async (ms = 10) => new Promise((res) => setTimeout(res, ms));
const { Fragment } = require('../../src/model/fragment');

describe('GET /v1/fragments/:id/info', () => {
  const ownerId = '7777';

  test('Unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/abc123/info').expect(401));

  test('Incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/abc/123')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('Authenticated user finds fragment info by ID', async () => {
    const fragment = new Fragment({ ownerId, type: 'text/plain', size: 0 });
    await wait();
    await fragment.setData('getInfoById() test');
    await fragment.save();
    const fragmentUrl = `/v1/fragments/${fragment.id}/info`;

    request(app)
      .get(fragmentUrl)
      .auth('test1@test.com', 'Test123$')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok'))
      .expect((res) => expect(res.body.fragments.size).toBeGreaterThan(0))
      .expect((res) => expect(res.headers['location']).not.toBeUndefined());
  });

  test('Request with non-existing ID returns 404', (done) => {
    request(app)
      .get('/v1/fragments/abc123/info')
      .auth('test1@test.com', 'Test123$')
      .expect(404)
      .expect((res) => expect(res.body.status).toBe('error'))
      .end(done);
  });
});

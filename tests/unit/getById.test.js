const request = require('supertest');
const app = require('../../src/app');
const wait = async (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));
const { Fragment } = require('../../src/model/fragment');

describe('GET /v1/fragments/:id', () => {
  const ownerId = '7777';

  test('Unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/abc123').expect(401));

  test('Incorrect credentials are denied', async () => {
    const fragment = new Fragment({ ownerId, type: 'text/plain', size: 0 });
    await wait();
    await fragment.setData('getById() test');
    await fragment.save();
    const fragmentUrl = `/v1/fragments/${fragment.id}`;

    request(app).get(fragmentUrl).auth('test1@test.com', 'incorrect_password').expect(401);
  });

  test('Authenticated users find a fragment by ID', async () => {
    const fragment = new Fragment({ ownerId, type: 'text/plain', size: 0 });
    await wait();
    await fragment.setData('getById() test');
    await fragment.save();
    const fragmentUrl = `/v1/fragments/${fragment.id}`;

    request(app)
      .get(fragmentUrl)
      .auth('test1@test.com', 'Test123$')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok'))
      .expect((res) => expect(res.body).toBe('getById() test'))
      .expect((res) => expect(res.headers['location']).not.toBeUndefined());
  });

  test('User gets html content that is converted from user input', async () => {
    const fragment = new Fragment({ ownerId, type: 'text/plain', size: 0 });
    await wait();
    await fragment.setData('# h1 heading');
    await fragment.save();
    const fragmentUrl = `/v1/fragments/${fragment.id}.html`;

    request(app)
      .get(fragmentUrl)
      .auth('test1@test.com', 'Test123$')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok'))
      .expect((res) => expect(res.body).toBe('<h1>h1 heading</h1>'))
      .expect((res) => expect(res.headers['content-type']).toBe('text/html'))
      .expect((res) => expect(res.headers['content-length']).toBeGreaterThan(0))
      .expect((res) => expect(res.headers['location']).not.toBeUndefined());
  });

  test('User receives a 404 for invalid convert type request', async () => {
    const fragment = new Fragment({ ownerId, type: 'text/plain', size: 0 });
    await wait();
    await fragment.setData('# h1 heading');
    await fragment.save();
    const fragmentUrl = `/v1/fragments/${fragment.id}.pdf`;

    request(app)
      .get(fragmentUrl)
      .auth('test1@test.com', 'Test123$')
      .expect(404)
      .expect((res) => expect(res.body.status).toBe('error'));
  });

  test('GET /v1/fragments returns 404', (done) => {
    const fragmentUrl = `/v1/fragments/abc123`;

    request(app)
      .get(fragmentUrl)
      .auth('test1@test.com', 'Test123$')
      .expect(404)
      .expect((res) => expect(res.body.status).toBe('error'))
      .end(done);
  });
});

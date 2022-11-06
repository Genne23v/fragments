const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
const wait = async (ms = 10) => new Promise((res) => setTimeout(res, ms));

describe('GET /v1/fragments', () => {
  afterAll((done) => {
    done();
  });
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

  test('Authenticated users get a expanded fragments array', async () => {
    const fragment = new Fragment({ ownerId: '7777', type: 'text/plain', size: 0 });
    await wait();
    await fragment.setData('get() expand test');
    await fragment.save();

    request(app)
      .get('/v1/fragments?expand=1')
      .auth('test1@test.com', 'Test123$')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok'))
      .expect((res) => expect(Array.isArray(res.body.fragments)).toBe(true))
      .expect((res) => expect(res.body.fragments.length).toBeGreaterThan(0))
      .expect((res) => expect(res.body.fragments[0].ownerId).toBe('7777'))
      .expect((res) => expect(res.body.fragments[0].size).toBeGreaterThan(0))
      .expect((res) => expect(res.headers['location']).not.toBeUndefined());
  });

  test('Wrong URL returns 404', (done) => {
    request(app)
      .get('/fragments')
      .auth('test1@test.com', 'Test123$')
      .expect(404)
      .expect((res) => expect(res.body.status).toBe('error'))
      .end(done);
  });
});

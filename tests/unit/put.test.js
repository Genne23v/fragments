const request = require('supertest');
const app = require('../../src/app');
const wait = async (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));
const { Fragment } = require('../../src/model/fragment');

describe('PUT /v1/fragments/:id', () => {
  const ownerId = '7777';

  test('Unauthenticated requests are denied', () => request(app).put('/v1/fragments').expect(401));

  test('Incorrect credentials are denied', () =>
    request(app).put('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  test('Authenticated users update posted fragment and get a 200 response', async () => {
    const fragment = new Fragment({ ownerId, type: 'text/plain', size: 0 });
    await wait();
    await fragment.setData('to be updated');
    await fragment.save();

    request(app)
      .put(`/v1/fragments/${fragment.id}`)
      .auth('test1@test.com', 'Test123$')
      .send('update fragment')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok'))
      .expect((res) => expect(res.body.fragment.type).toBe('text/plain'))
      .expect((res) => expect(res.body.fragment.size).toBe(13));
  });

  test('Users update fragment and its content type', async () => {
    const fragment = new Fragment({ ownerId, type: 'text/markdown', size: 0 });
    await wait();
    await fragment.setData('*Markdown*');
    await fragment.save();

    request(app)
      .put(`/v1/fragments/${fragment.id}`)
      .auth('test1@test.com', 'Test123$')
      .send('Markdown to text')
      .set('Content-Type', 'text/plain')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok'))
      .expect((res) => expect(res.body.fragment.type).toBe('text/plain'));
  });

  test('Authenticated users request invalid fragment ID and get a 404 response', () => {
    request(app)
      .put(`/v1/fragments/abc-123`)
      .auth('test1@test.com', 'Test123$')
      .set('Content-Type', 'text/plain')
      .send('update test')
      .expect(404)
      .expect((res) => expect(res.body.status).toBe('error'));
  });
});

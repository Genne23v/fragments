const request = require('supertest');
const app = require('../../src/app');
const wait = async (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));
const { Fragment } = require('../../src/model/fragment');

describe('DELETE /v1/fragments/:id', () => {
  const ownerId = '7777';

  test('Unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments').expect(401));

  test('Incorrect credentials are denied', () =>
    request(app)
      .delete('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('Authenticated users receives 404 after sending delete request with a wrong ID', async () => {
    const fragment = new Fragment({ ownerId, type: 'text/plain', size: 0 });
    await wait();
    await fragment.setData('to be deleted');
    await fragment.save();

    request(app)
      .delete(`/v1/fragments/wrong-id`)
      .auth('test1@test.com', 'Test123$')
      .expect(404)
      .expect((res) => expect(res.body.status).toBe('error'));
  });

  test('Authenticated users sends a delete request and receives 200', async () => {
    const fragment = new Fragment({ ownerId, type: 'text/plain', size: 0 });
    await wait();
    await fragment.setData('to be deleted');
    await fragment.save();
    const fragmentUrl = `/v1/fragments/${fragment.id}`;

    request(app)
      .delete(`${fragmentUrl}`)
      .auth('test1@test.com', 'Test123$')
      .expect(200)
      .expect((res) => expect(res.body.status).toBe('ok'));
  });
});

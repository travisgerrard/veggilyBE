import request from 'supertest';
import { app } from '../../../app';
import mongoose from 'mongoose';
// import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the meal is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/meals/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asfasdf',
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .put(`/api/meals/${id}`)
    .send({
      title: 'asfasdf',
    })
    .expect(401);
});

it('returns a 401 user does not own the meal', async () => {
  const response = await request(app)
    .post(`/api/meals/`)
    .set('Cookie', global.signin())
    .send({
      title: 'asfasdf',
    })
    .expect(201);

  await request(app)
    .put(`/api/meals/${response.body.id}/addTag`)
    .set('Cookie', global.signin())
    .send({
      tag: 'dinner',
    })
    .expect(401);
});

it('returns a 400 user provides an invalid tag', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/meals/`)
    .set('Cookie', cookie)
    .send({
      title: 'asfasdf',
    });

  await request(app)
    .put(`/api/meals/${response.body.id}/addTag`)
    .set('Cookie', cookie)
    .send({
      tag: '',
    })
    .expect(400);
});

it('updates the meal provided valid tag', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/meals/`)
    .set('Cookie', cookie)
    .send({
      title: 'asfasdf',
    });

  await request(app)
    .put(`/api/meals/${response.body.id}/addTag`)
    .set('Cookie', cookie)
    .send({
      tag: 'dinner',
    })
    .expect(200);

  const mealResponse = await request(app)
    .get(`/api/meals/${response.body.id}`)
    .send();

  expect(mealResponse.body.tags[0]).toEqual('dinner');
});

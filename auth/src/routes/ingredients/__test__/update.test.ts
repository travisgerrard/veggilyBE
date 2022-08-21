import request from 'supertest';
import { app } from '../../../app';
import mongoose from 'mongoose';
// import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the ingredient is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/ingredients/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asfasdf',
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .put(`/api/ingredients/${id}`)
    .send({
      title: 'asfasdf',
    })
    .expect(401);
});

it('returns a 401 user does not own the ingredient', async () => {
  const response = await request(app)
    .post(`/api/ingredients/`)
    .set('Cookie', global.signin())
    .send({
      title: 'asfasdf',
    })
    .expect(201);

  await request(app)
    .put(`/api/ingredients/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asfasdfasfsdafds',
    })
    .expect(401);
});

it('returns a 400 user provides an invalid title', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/ingredients/`)
    .set('Cookie', cookie)
    .send({
      title: 'asfasdf',
    });

  await request(app)
    .put(`/api/ingredients/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
    })
    .expect(400);
});

it('updates the meal provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/ingredients/`)
    .set('Cookie', cookie)
    .send({
      title: 'asfasdf',
    });

  await request(app)
    .put(`/api/ingredients/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
    })
    .expect(200);

  const ingredientResponse = await request(app)
    .get(`/api/ingredients/${response.body.id}`)
    .send();

  expect(ingredientResponse.body.title).toEqual('new title');
});

// it('publishes an event', async () => {
//   const cookie = global.signin();

//   const response = await request(app)
//     .post(`/api/ingredients/`)
//     .set('Cookie', cookie)
//     .send({
//       title: 'asfasdf',
//     });

//   await request(app)
//     .put(`/api/ingredients/${response.body.id}`)
//     .set('Cookie', cookie)
//     .send({
//       title: 'new title',
//     })
//     .expect(200);

//   expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
// });

import request from 'supertest';
import { app } from '../../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/meals/${id}`).send().expect(404);
});

it('returns the meal if the meal is found', async () => {
  const title = 'asldkfj';

  const response = await request(app)
    .post('/api/meals')
    .set('Cookie', global.signin())
    .send({
      title,
    })
    .expect(201);

  const mealResponse = await request(app)
    .get(`/api/meals/${response.body.id}`)
    .send()
    .expect(200);

  expect(mealResponse.body.title).toEqual(title);
});

import request from 'supertest';
import { app } from '../../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ingredient is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/ingredients/${id}`).send().expect(404);
});

it('returns the ingredient if the ingredient is found', async () => {
  const title = 'asldkfj';

  const response = await request(app)
    .post('/api/ingredients')
    .set('Cookie', global.signin())
    .send({
      title,
    })
    .expect(201);

  const ingredientResponse = await request(app)
    .get(`/api/ingredients/${response.body.id}`)
    .send()
    .expect(200);

  expect(ingredientResponse.body.title).toEqual(title);
});

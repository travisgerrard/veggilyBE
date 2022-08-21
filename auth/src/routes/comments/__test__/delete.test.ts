import request from 'supertest';
import { app } from '../../../app';
import mongoose from 'mongoose';
import { Meal } from '../../../models/meal';

it('deletes an ingredient', async () => {
  const cookie = global.signin();
  const mealTitle = 'Tofu bake';

  const createMeal = await request(app)
    .post(`/api/meals/`)
    .set('Cookie', cookie)
    .send({
      title: mealTitle,
    });

  const meal = await Meal.findById(createMeal.body.id);

  const comment = 'asldkfj';

  const commentOne = await request(app)
    .post('/api/comments')
    .set('Cookie', cookie)
    .send({
      comment,
      dateMade: new Date(),
      mealId: meal!.id,
    })
    .expect(201);

  await request(app)
    .delete(`/api/comments/${commentOne.body.id}`)
    .set('Cookie', cookie)
    .expect(204);

  const response = await request(app)
    .get(`/api/comments/meal/${meal!.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(0);
});

import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { Meal } from '../../../models/meal';

it('can fetch a list of comments for a meal', async () => {
  const cookie = global.signin();
  const mealTitle = 'Tofu bake';

  const createMeal = await request(app)
    .post(`/api/meals/`)
    .set('Cookie', cookie)
    .send({
      title: mealTitle,
    });

  const meal = await Meal.findById(createMeal.body.id);
  const comment = 'comment';

  await request(app)
    .post('/api/comments')
    .set('Cookie', cookie)
    .send({
      comment,
      mealId: meal!.id,
      dateMade: new Date(),
    })
    .expect(201);

  await request(app)
    .post('/api/comments')
    .set('Cookie', cookie)
    .send({
      comment,
      mealId: meal!.id,
      dateMade: new Date(),
    })
    .expect(201);

  await request(app)
    .post('/api/comments')
    .set('Cookie', cookie)
    .send({
      comment,
      mealId: meal!.id,
      dateMade: new Date(),
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/comments/meal/${meal!.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});

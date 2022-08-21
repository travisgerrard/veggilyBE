import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';

it('adds meal to plan', async () => {
  const cookie = global.signin();

  const mealTitle = 'Tofu bake';

  const meal = await request(app)
    .post('/api/meals')
    .set('Cookie', cookie)
    .send({
      title: mealTitle,
    })
    .expect(201);

  await request(app)
    .post(`/api/meals/addMealToPlan/${meal.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  const plans = await request(app)
    .get('/api/plans')
    .set('Cookie', cookie)
    .send({});

  expect(plans.body.length).toEqual(1);
});

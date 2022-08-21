import request from 'supertest';
import { app } from '../../../app';

import mongoose from 'mongoose';
import { Meal } from '../../../models/meal';

it('returns the ingredients for a given meal', async () => {
  const cookie = global.signin();
  const mealTitle = 'Tofu bake';

  const response = await request(app)
    .post(`/api/meals/`)
    .set('Cookie', cookie)
    .send({
      title: mealTitle,
    });

  const meal = { id: response.body.id };

  const titleOne = 'titleOne';
  const titleTwo = 'titleTwo';
  const titleThree = 'titleThree';

  await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title: titleOne,
      mealId: meal.id,
    })
    .expect(201);

  await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title: titleTwo,
      mealId: meal.id,
    })
    .expect(201);

  await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title: titleThree,
    })
    .expect(201);

  const ingredientResponse = await request(app)
    .get(`/api/ingredients/meal/${meal.id}`)
    .send()
    .expect(200);

  expect(ingredientResponse.body.length).toEqual(2);
});

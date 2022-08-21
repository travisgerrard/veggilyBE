import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';

it('adds ingredient to list', async () => {
  const cookie = global.signin();
  const mealTitle = 'Tofu bake';

  const createMeal = await request(app)
    .post(`/api/meals/`)
    .set('Cookie', cookie)
    .send({
      title: mealTitle,
    });

  const title = 'ingredient test';

  const createIngredient = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: createMeal.body.id,
    })
    .expect(201);

  await request(app)
    .post(`/api/ingredients/addIngredientToList/${createIngredient.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);
  await request(app)
    .post(`/api/ingredients/addIngredientToList/${createIngredient.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  const allLists = await request(app)
    .get('/api/lists')
    .set('Cookie', cookie)
    .send({});

  expect(allLists.body.length).toEqual(2);
  expect(allLists.body[0].meal).toEqual(createMeal.body.id);
  expect(allLists.body[1].meal).toEqual(createMeal.body.id);
});

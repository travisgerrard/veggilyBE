import request from 'supertest';
import { app } from '../../../app';
import mongoose from 'mongoose';
import { Ingredient } from '../../../models/ingredient';
import { Meal } from '../../../models/meal';

it('deletes an ingredient', async () => {
  const cookie = global.signin();

  const title = 'asldkfj';

  const ingredient = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
    })
    .expect(201);

  await request(app)
    .delete(`/api/ingredients/${ingredient.body.id}`)
    .set('Cookie', cookie)
    .expect(204);

  const response = await request(app)
    .get('/api/ingredients')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(0);
});

it('deletes an ingredient, preserves ordernumber of other ingredients', async () => {
  const cookie = global.signin();
  const mealTitle = 'Tofu bake';

  const response = await request(app)
    .post(`/api/meals/`)
    .set('Cookie', cookie)
    .send({
      title: mealTitle,
    });

  let ingredients = await Ingredient.find({});
  expect(ingredients.length).toEqual(0);

  const title = 'asldkfj';

  // 0
  const ingredientZero = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: response.body.id,
    })
    .expect(201);

  // 1
  const ingredientOne = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: response.body.id,
    })
    .expect(201);

  // 2
  const ingredientTwo = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: response.body.id,
    })
    .expect(201);

  // 3
  const ingredientThree = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: response.body.id,
    })
    .expect(201);

  await request(app)
    .delete(`/api/ingredients/${ingredientZero.body.id}`)
    .set('Cookie', cookie)
    .expect(204);

  const responseTwo = await request(app)
    .get(`/api/ingredients/meal/${response.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(responseTwo.body[0].orderNumber).toEqual(0);
  expect(responseTwo.body[1].orderNumber).toEqual(1);
  expect(responseTwo.body[2].orderNumber).toEqual(2);
  expect(responseTwo.body.length).toEqual(3);
});

it('deletes an ingredient, preserves ordernumber of other ingredients', async () => {
  const cookie = global.signin();
  const mealTitle = 'Tofu bake';

  const response = await request(app)
    .post(`/api/meals/`)
    .set('Cookie', cookie)
    .send({
      title: mealTitle,
    });

  let ingredients = await Ingredient.find({});
  expect(ingredients.length).toEqual(0);

  const title = 'asldkfj';

  // 0
  const ingredientZero = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: response.body.id,
    })
    .expect(201);

  // 1
  const ingredientOne = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: response.body.id,
    })
    .expect(201);

  // 2
  const ingredientTwo = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: response.body.id,
    })
    .expect(201);

  // 3
  const ingredientThree = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: response.body.id,
    })
    .expect(201);

  await request(app)
    .delete(`/api/ingredients/${ingredientTwo.body.id}`)
    .set('Cookie', cookie)
    .expect(204);

  const responseTwo = await request(app)
    .get(`/api/ingredients/meal/${response.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(responseTwo.body[0].orderNumber).toEqual(0);
  expect(responseTwo.body[1].orderNumber).toEqual(1);
  expect(responseTwo.body[2].orderNumber).toEqual(2);
  expect(responseTwo.body.length).toEqual(3);
});

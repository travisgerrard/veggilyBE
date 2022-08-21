import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';
import { Ingredient } from '../../../models/ingredient';
import { Meal } from '../../../models/meal';
// import { natsWrapper } from '../../nats-wrapper';

it('creates an ingredient with valid input linked to a meal, and increases order accordingly', async () => {
  const cookie = global.signin();
  const mealTitle = 'Tofu bake';

  const response = await request(app)
    .post(`/api/meals/`)
    .set('Cookie', cookie)
    .send({
      title: mealTitle,
    });

  const meal = { id: response.body.id };

  let ingredients = await Ingredient.find({});
  expect(ingredients.length).toEqual(0);

  const title = 'asldkfj';

  // 0
  const ingredientZero = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: meal.id,
    })
    .expect(201);

  // 1
  const ingredientOne = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: meal.id,
    })
    .expect(201);

  // 2
  const ingredientTwo = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: meal.id,
    })
    .expect(201);

  // 3
  const ingredientThree = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: meal.id,
    })
    .expect(201);

  ingredients = await Ingredient.find({}).populate('meal').sort('orderNumber');

  expect(ingredients.length).toEqual(4);
  expect(ingredients[0].title).toEqual(title);
  expect(ingredients[0].meal.title).toEqual(mealTitle);
  expect(ingredients[0].orderNumber).toEqual(0);
  expect(ingredients[1].orderNumber).toEqual(1);
  expect(ingredients[2].orderNumber).toEqual(2);
  expect(ingredients[3].orderNumber).toEqual(3);
  expect(ingredients[3].id).toEqual(ingredientThree.body.id);

  await request(app)
    .put(`/api/ingredients/increase/${ingredientZero.body.id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  ingredients = await Ingredient.find({}).populate('meal').sort('orderNumber');

  expect(ingredients[1].id).toEqual(ingredientZero.body.id);
});

it('creates an ingredient with valid input linked to a meal, but cannot increase order number if order number last one in list', async () => {
  const cookie = global.signin();
  const mealTitle = 'Tofu bake';

  const response = await request(app)
    .post(`/api/meals/`)
    .set('Cookie', cookie)
    .send({
      title: mealTitle,
    });

  const meal = { id: response.body.id };

  let ingredients = await Ingredient.find({});
  expect(ingredients.length).toEqual(0);

  const title = 'asldkfj';

  // 0
  const ingredientZero = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: meal.id,
    })
    .expect(201);

  // 1
  const ingredientOne = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: meal.id,
    })
    .expect(201);

  // 2
  const ingredientTwo = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: meal.id,
    })
    .expect(201);

  // 3
  const ingredientThree = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
      mealId: meal.id,
    })
    .expect(201);

  ingredients = await Ingredient.find({}).populate('meal').sort('orderNumber');

  expect(ingredients.length).toEqual(4);
  expect(ingredients[0].title).toEqual(title);
  expect(ingredients[0].meal.title).toEqual(mealTitle);
  expect(ingredients[0].orderNumber).toEqual(0);
  expect(ingredients[1].orderNumber).toEqual(1);
  expect(ingredients[2].orderNumber).toEqual(2);
  expect(ingredients[3].orderNumber).toEqual(3);
  expect(ingredients[3].id).toEqual(ingredientThree.body.id);

  await request(app)
    .put(`/api/ingredients/increase/${ingredientThree.body.id}`)
    .set('Cookie', cookie)
    .send({})
    .expect(400);
});

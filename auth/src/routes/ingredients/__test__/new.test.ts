import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';
import { Ingredient } from '../../../models/ingredient';
import { Meal } from '../../../models/meal';
// import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/ingredients for post requests', async () => {
  const response = await request(app).post('/api/ingredients').send({});

  expect(response.status).not.toEqual(400);
});

it('cannot be accessed if the user is not signed in', async () => {
  await request(app).post('/api/ingredients').send({}).expect(401);
});

it('can be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/ingredients')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/ingredients')
    .set('Cookie', global.signin())
    .send({
      title: '',
    })
    .expect(400);

  await request(app)
    .post('/api/ingredients')
    .set('Cookie', global.signin())
    .send({})
    .expect(400);
});

it('creates a ingredient with valid input', async () => {
  let ingredients = await Ingredient.find({});
  expect(ingredients.length).toEqual(0);

  const title = 'asldkfj';

  await request(app)
    .post('/api/ingredients')
    .set('Cookie', global.signin())
    .send({
      title,
    })
    .expect(201);

  ingredients = await Ingredient.find({});
  expect(ingredients.length).toEqual(1);
  expect(ingredients[0].title).toEqual(title);
  expect(ingredients[0].orderNumber).toEqual(0);
});

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

  // 1
  await request(app)
    .post('/api/ingredients')
    .set('Cookie', global.signin())
    .send({
      title,
      mealId: meal.id,
    })
    .expect(201);

  // 2
  await request(app)
    .post('/api/ingredients')
    .set('Cookie', global.signin())
    .send({
      title,
      mealId: meal.id,
    })
    .expect(201);

  // 3
  await request(app)
    .post('/api/ingredients')
    .set('Cookie', global.signin())
    .send({
      title,
      mealId: meal.id,
    })
    .expect(201);

  // 4
  await request(app)
    .post('/api/ingredients')
    .set('Cookie', global.signin())
    .send({
      title,
      mealId: meal.id,
    })
    .expect(201);

  ingredients = await Ingredient.find({}).populate('meal');

  expect(ingredients.length).toEqual(4);
  expect(ingredients[0].title).toEqual(title);
  expect(ingredients[0].meal.title).toEqual(mealTitle);
  expect(ingredients[0].orderNumber).toEqual(0);
  expect(ingredients[1].orderNumber).toEqual(1);
  expect(ingredients[2].orderNumber).toEqual(2);
  expect(ingredients[3].orderNumber).toEqual(3);
});

// it('publishes an event', async () => {
//   const title = 'asldkfj';

//   await request(app)
//     .post('/api/ingredients')
//     .set('Cookie', global.signin())
//     .send({
//       title,
//     })
//     .expect(201);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// });

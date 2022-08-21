import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { Meal } from '../../../models/meal';

it('has a route handler listening to /api/comments for post requests', async () => {
  const response = await request(app).post('/api/comments').send({});

  expect(response.status).not.toEqual(400);
});

it('cannot be accessed if the user is not signed in', async () => {
  await request(app).post('/api/comments').send({}).expect(401);
});

it('can be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/comments')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns creates a comment for a given meal', async () => {
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

  const response = await request(app)
    .post('/api/comments')
    .set('Cookie', cookie)
    .send({
      comment,
      mealId: meal!.id,
      dateMade: new Date(),
    })
    .expect(201);

  expect(response.body.comment).toEqual(comment);
});

it('returns creates a comment for a given meal with specific date', async () => {
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
  const dateMade = new Date();
  dateMade.setMonth(dateMade.getMonth() - 10);

  const response = await request(app)
    .post('/api/comments')
    .set('Cookie', cookie)
    .send({
      comment,
      mealId: meal!.id,
      dateMade,
    })
    .expect(201);

  expect(response.body.dateMade).toEqual(dateMade.toISOString());
  expect(response.body.comment).toEqual(comment);
});

it('does not creates a comment if no meal is given', async () => {
  const cookie = global.signin();

  const comment = 'comment';

  const response = await request(app)
    .post('/api/comments')
    .set('Cookie', cookie)
    .send({
      comment,
    })
    .expect(400);
});

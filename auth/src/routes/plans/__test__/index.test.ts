import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { Plan } from '../../../models/plan';
import { Meal } from '../../../models/meal';
import { IngredientType } from '@tgticketing/common';
import { List } from '../../../models/list';

it('has a route handler planening to /api/plans for get requests', async () => {
  const response = await request(app).get('/api/plans').send({});

  expect(response.status).not.toEqual(400);
});

it('returns plan items', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const cookie = global.signin();
  const mealTitle = 'Tofu bake';

  const response = await request(app)
    .post(`/api/meals/`)
    .set('Cookie', cookie)
    .send({
      title: mealTitle,
    });

  const meal = await Meal.findById(response.body.id);

  const listOne = List.build({
    title: 'List One',
    ingredientType: IngredientType.None,
    meal: meal!,
    creatorId: userId,
    isCompleted: false,
  });
  await listOne.save();

  const planOne = Plan.build({
    meal: meal!,
    datePlanToMake: new Date(),
    creatorId: userId,
    isCompleted: false,
  });
  await planOne.save();
  const planTwo = Plan.build({
    meal: meal!,
    datePlanToMake: new Date(),
    creatorId: userId,
    isCompleted: false,
  });
  await planTwo.save();

  const allPlans = await request(app)
    .get('/api/plans')
    .set('Cookie', global.signin(userId))
    .send({});

  console.log(allPlans.body);
  console.log(allPlans.body[0].ingredients);

  expect(allPlans.body.length).toEqual(2);
});

import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { Plan } from '../../../models/plan';
import { Meal } from '../../../models/meal';

it('toggles a plan item', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const cookie = global.signin();
  const mealTitle = 'Tofu bake';

  const createMeal = await request(app)
    .post(`/api/meals/`)
    .set('Cookie', cookie)
    .send({
      title: mealTitle,
    });

  const meal = await Meal.findById(createMeal.body.id);

  const plan = Plan.build({
    meal: meal!,
    datePlanToMake: new Date(),
    creatorId: userId,
    isCompleted: false,
  });
  await plan.save();

  const response = await request(app)
    .put(`/api/plans/toggle/${plan.id}`)
    .set('Cookie', global.signin(userId))
    .send({});

  expect(response.body.isCompleted).toEqual(true);

  const responseTwo = await request(app)
    .put(`/api/plans/toggle/${plan.id}`)
    .set('Cookie', global.signin(userId))
    .send({});

  expect(responseTwo.body.isCompleted).toEqual(false);
});

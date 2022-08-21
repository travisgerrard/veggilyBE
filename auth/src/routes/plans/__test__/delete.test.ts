import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { Plan } from '../../../models/plan';
import { Meal } from '../../../models/meal';

it('deletes a plan item', async () => {
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

  const plan = Plan.build({
    meal: meal!,
    datePlanToMake: new Date(),
    creatorId: userId,
    isCompleted: false,
  });
  await plan.save();

  await request(app)
    .delete(`/api/plans/${plan.id}`)
    .set('Cookie', global.signin(userId))
    .send({});

  const allLists = await request(app)
    .get('/api/plans')
    .set('Cookie', global.signin(userId))
    .send({});

  expect(allLists.body.length).toEqual(0);
});

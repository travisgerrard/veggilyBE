import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { Plan } from '../../../models/plan';
import { Meal } from '../../../models/meal';

it('updates a plan', async () => {
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

  const nowDate = new Date();

  const plan = Plan.build({
    meal: meal!,
    datePlanToMake: nowDate,
    creatorId: userId,
    isCompleted: false,
  });
  await plan.save();

  const updateDatePlanToMake = new Date();
  updateDatePlanToMake.setMonth(updateDatePlanToMake.getMonth() - 10);

  const response = await request(app)
    .put(`/api/plans/update/${plan.id}`)
    .set('Cookie', global.signin(userId))
    .send({
      datePlanToMake: updateDatePlanToMake,
    });

  expect(response.body.datePlanToMake).toEqual(
    updateDatePlanToMake.toISOString()
  );
  expect(response.body.datePlanToMake).not.toEqual(nowDate.toISOString());
});

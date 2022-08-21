import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { IngredientType } from '@tgticketing/common';
import { List } from '../../../models/list';

it('has a route handler listening to /api/lists for get requests', async () => {
  const response = await request(app).get('/api/lists').send({});

  expect(response.status).not.toEqual(400);
});

it('returns list items', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  let meal: any;
  const listOne = List.build({
    title: 'List One',
    ingredientType: IngredientType.None,
    meal,
    creatorId: userId,
    isCompleted: false,
  });
  await listOne.save();
  const listTwo = List.build({
    title: 'List One',
    ingredientType: IngredientType.None,
    meal,
    creatorId: userId,
    isCompleted: false,
  });
  await listTwo.save();

  const allLists = await request(app)
    .get('/api/lists')
    .set('Cookie', global.signin(userId))
    .send({});

  expect(allLists.body.length).toEqual(2);
});

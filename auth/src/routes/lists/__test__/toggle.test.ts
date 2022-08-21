import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { List } from '../../../models/list';
import { IngredientType } from '@tgticketing/common';

it('toggles a list item', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  let meal: any;
  const list = List.build({
    title: 'List One',
    ingredientType: IngredientType.None,
    meal,
    creatorId: userId,
    isCompleted: false,
  });
  await list.save();

  const response = await request(app)
    .put(`/api/lists/${list.id}`)
    .set('Cookie', global.signin(userId))
    .send({});

  expect(response.body.isCompleted).toEqual(true);

  const responseTwo = await request(app)
    .put(`/api/lists/${list.id}`)
    .set('Cookie', global.signin(userId))
    .send({});

  expect(responseTwo.body.isCompleted).toEqual(false);
});

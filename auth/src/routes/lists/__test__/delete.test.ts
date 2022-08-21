import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { List } from '../../../models/list';
import { IngredientType } from '@tgticketing/common';

it('deletes a list item', async () => {
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

  await request(app)
    .delete(`/api/lists/${list.id}`)
    .set('Cookie', global.signin(userId))
    .send({});

  const allLists = await request(app)
    .get('/api/lists')
    .set('Cookie', global.signin(userId))
    .send({});

  expect(allLists.body.length).toEqual(0);
});

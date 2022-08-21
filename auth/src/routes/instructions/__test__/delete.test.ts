import request from 'supertest';
import { app } from '../../../app';
import { Instruction } from '../../../models/instruction';

it('deletes an instruction', async () => {
  const cookie = global.signin();

  const text = 'asldkfj';

  const instruction = await request(app)
    .post('/api/instructions')
    .set('Cookie', cookie)
    .send({
      text,
    })
    .expect(201);

  await request(app)
    .delete(`/api/instructions/${instruction.body.id}`)
    .set('Cookie', cookie)
    .expect(204);

  const response = await request(app)
    .get('/api/instructions')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(0);
});

it('deletes an instruction, preserves ordernumber of other instruction', async () => {
  const cookie = global.signin();
  const mealTitle = 'Tofu bake';

  const response = await request(app)
    .post(`/api/meals/`)
    .set('Cookie', cookie)
    .send({
      title: mealTitle,
    });

  let instructions = await Instruction.find({});
  expect(instructions.length).toEqual(0);

  const text = 'asldkfj';

  // 0
  const instructionZero = await request(app)
    .post('/api/instructions')
    .set('Cookie', cookie)
    .send({
      text,
      mealId: response.body.id,
    })
    .expect(201);

  // 1
  const instructionOne = await request(app)
    .post('/api/instructions')
    .set('Cookie', cookie)
    .send({
      text,
      mealId: response.body.id,
    })
    .expect(201);

  // 2

  await request(app)
    .delete(`/api/instructions/${instructionZero.body.id}`)
    .set('Cookie', cookie)
    .expect(204);

  const responseTwo = await request(app)
    .get(`/api/instructions/meal/${response.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  // console.log(responseTwo.body);

  expect(responseTwo.body[0].orderNumber).toEqual(0);
  expect(responseTwo.body.length).toEqual(1);
});

import request from 'supertest';
import { app } from '../../../app';

const createMeal = () => {
  const title = 'asdfasdfdf';

  return request(app).post('/api/meals').set('Cookie', global.signin()).send({
    title,
  });
};

it('can fetch a list of meals', async () => {
  await createMeal();
  await createMeal();
  await createMeal();

  const response = await request(app).get('/api/meals').send().expect(200);

  expect(response.body.length).toEqual(3);
});

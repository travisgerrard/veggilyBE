import request from 'supertest';
import { app } from '../../../app';

const createIngredient = () => {
  const title = 'asdfasdfdf';

  return request(app)
    .post('/api/ingredients')
    .set('Cookie', global.signin())
    .send({
      title,
    });
};

it('can fetch a list of tickets', async () => {
  await createIngredient();
  await createIngredient();
  await createIngredient();

  const response = await request(app)
    .get('/api/ingredients')
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});

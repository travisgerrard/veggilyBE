import request from 'supertest';
import { app } from '../../../app';

it('can be accessed if the user is signed in', async () => {
  const url = 'https://minimalistbaker.com/chickpea-shawarma-salad/';

  const response = await request(app)
    .post(`/api/general`)
    .set('Cookie', global.signin())
    .send({
      url,
    });

  console.log(response.body);

  expect(response.status).not.toEqual(401);
});

import request from 'supertest';
import { app } from '../../../app';
import { Meal } from '../../../models/meal';
// import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/meals for post requests', async () => {
  const response = await request(app).post('/api/meals').send({});

  expect(response.status).not.toEqual(400);
});

it('cannot be accessed if the user is not signed in', async () => {
  await request(app).post('/api/meals').send({}).expect(401);
});

it('can be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/meals')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/meals')
    .set('Cookie', global.signin())
    .send({
      title: '',
    })
    .expect(400);

  await request(app)
    .post('/api/meals')
    .set('Cookie', global.signin())
    .send({})
    .expect(400);
});

it('creates a meal with valid input', async () => {
  let meals = await Meal.find({});
  expect(meals.length).toEqual(0);

  const title = 'asldkfj';

  await request(app)
    .post('/api/meals')
    .set('Cookie', global.signin())
    .send({
      title,
    })
    .expect(201);

  meals = await Meal.find({});
  console.log(meals[0]);

  expect(meals.length).toEqual(1);
  expect(meals[0].title).toEqual(title);
});

// it('publishes an event', async () => {
//   const title = 'asldkfj';

//   await request(app)
//     .post('/api/meals')
//     .set('Cookie', global.signin())
//     .send({
//       title,
//     })
//     .expect(201);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// });

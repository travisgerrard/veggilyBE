"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const mongoose_1 = __importDefault(require("mongoose"));
// import { natsWrapper } from '../../nats-wrapper';
it('returns a 404 if the ingredient is not found', async () => {
    const id = new mongoose_1.default.Types.ObjectId().toHexString();
    await (0, supertest_1.default)(app_1.app)
        .put(`/api/ingredients/${id}`)
        .set('Cookie', global.signin())
        .send({
        title: 'asfasdf',
    })
        .expect(404);
});
it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose_1.default.Types.ObjectId().toHexString();
    const response = await (0, supertest_1.default)(app_1.app)
        .put(`/api/ingredients/${id}`)
        .send({
        title: 'asfasdf',
    })
        .expect(401);
});
it('returns a 401 user does not own the ingredient', async () => {
    const response = await (0, supertest_1.default)(app_1.app)
        .post(`/api/ingredients/`)
        .set('Cookie', global.signin())
        .send({
        title: 'asfasdf',
    })
        .expect(201);
    await (0, supertest_1.default)(app_1.app)
        .put(`/api/ingredients/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
        title: 'asfasdfasfsdafds',
    })
        .expect(401);
});
it('returns a 400 user provides an invalid title', async () => {
    const cookie = global.signin();
    const response = await (0, supertest_1.default)(app_1.app)
        .post(`/api/ingredients/`)
        .set('Cookie', cookie)
        .send({
        title: 'asfasdf',
    });
    await (0, supertest_1.default)(app_1.app)
        .put(`/api/ingredients/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
        title: '',
    })
        .expect(400);
});
it('updates the meal provided valid inputs', async () => {
    const cookie = global.signin();
    const response = await (0, supertest_1.default)(app_1.app)
        .post(`/api/ingredients/`)
        .set('Cookie', cookie)
        .send({
        title: 'asfasdf',
    });
    await (0, supertest_1.default)(app_1.app)
        .put(`/api/ingredients/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
        title: 'new title',
    })
        .expect(200);
    const ingredientResponse = await (0, supertest_1.default)(app_1.app)
        .get(`/api/ingredients/${response.body.id}`)
        .send();
    expect(ingredientResponse.body.title).toEqual('new title');
});
// it('publishes an event', async () => {
//   const cookie = global.signin();
//   const response = await request(app)
//     .post(`/api/ingredients/`)
//     .set('Cookie', cookie)
//     .send({
//       title: 'asfasdf',
//     });
//   await request(app)
//     .put(`/api/ingredients/${response.body.id}`)
//     .set('Cookie', cookie)
//     .send({
//       title: 'new title',
//     })
//     .expect(200);
//   expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
// });

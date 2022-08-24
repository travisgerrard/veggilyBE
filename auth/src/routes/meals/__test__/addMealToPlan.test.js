"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
it('adds meal to plan', async () => {
    const cookie = global.signin();
    const mealTitle = 'Tofu bake';
    const meal = await (0, supertest_1.default)(app_1.app)
        .post('/api/meals')
        .set('Cookie', cookie)
        .send({
        title: mealTitle,
    })
        .expect(201);
    await (0, supertest_1.default)(app_1.app)
        .post(`/api/meals/addMealToPlan/${meal.body.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200);
    const plans = await (0, supertest_1.default)(app_1.app)
        .get('/api/plans')
        .set('Cookie', cookie)
        .send({});
    expect(plans.body.length).toEqual(1);
});

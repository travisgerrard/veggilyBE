"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const meal_1 = require("../../../models/meal");
it('can fetch a list of comments for a meal', async () => {
    const cookie = global.signin();
    const mealTitle = 'Tofu bake';
    const createMeal = await (0, supertest_1.default)(app_1.app)
        .post(`/api/meals/`)
        .set('Cookie', cookie)
        .send({
        title: mealTitle,
    });
    const meal = await meal_1.Meal.findById(createMeal.body.id);
    const comment = 'comment';
    await (0, supertest_1.default)(app_1.app)
        .post('/api/comments')
        .set('Cookie', cookie)
        .send({
        comment,
        mealId: meal.id,
        dateMade: new Date(),
    })
        .expect(201);
    await (0, supertest_1.default)(app_1.app)
        .post('/api/comments')
        .set('Cookie', cookie)
        .send({
        comment,
        mealId: meal.id,
        dateMade: new Date(),
    })
        .expect(201);
    await (0, supertest_1.default)(app_1.app)
        .post('/api/comments')
        .set('Cookie', cookie)
        .send({
        comment,
        mealId: meal.id,
        dateMade: new Date(),
    })
        .expect(201);
    const response = await (0, supertest_1.default)(app_1.app)
        .get(`/api/comments/meal/${meal.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200);
    expect(response.body.length).toEqual(3);
});

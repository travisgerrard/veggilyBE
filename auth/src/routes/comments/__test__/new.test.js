"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const meal_1 = require("../../../models/meal");
it('has a route handler listening to /api/comments for post requests', async () => {
    const response = await (0, supertest_1.default)(app_1.app).post('/api/comments').send({});
    expect(response.status).not.toEqual(400);
});
it('cannot be accessed if the user is not signed in', async () => {
    await (0, supertest_1.default)(app_1.app).post('/api/comments').send({}).expect(401);
});
it('can be accessed if the user is signed in', async () => {
    const response = await (0, supertest_1.default)(app_1.app)
        .post('/api/comments')
        .set('Cookie', global.signin())
        .send({});
    expect(response.status).not.toEqual(401);
});
it('returns creates a comment for a given meal', async () => {
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
    const response = await (0, supertest_1.default)(app_1.app)
        .post('/api/comments')
        .set('Cookie', cookie)
        .send({
        comment,
        mealId: meal.id,
        dateMade: new Date(),
    })
        .expect(201);
    expect(response.body.comment).toEqual(comment);
});
it('returns creates a comment for a given meal with specific date', async () => {
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
    const dateMade = new Date();
    dateMade.setMonth(dateMade.getMonth() - 10);
    const response = await (0, supertest_1.default)(app_1.app)
        .post('/api/comments')
        .set('Cookie', cookie)
        .send({
        comment,
        mealId: meal.id,
        dateMade,
    })
        .expect(201);
    expect(response.body.dateMade).toEqual(dateMade.toISOString());
    expect(response.body.comment).toEqual(comment);
});
it('does not creates a comment if no meal is given', async () => {
    const cookie = global.signin();
    const comment = 'comment';
    const response = await (0, supertest_1.default)(app_1.app)
        .post('/api/comments')
        .set('Cookie', cookie)
        .send({
        comment,
    })
        .expect(400);
});

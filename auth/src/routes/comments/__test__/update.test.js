"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const meal_1 = require("../../../models/meal");
it('updates the comment provided valid inputs', async () => {
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
    const updatedComment = 'updatedComment';
    const dateMade = new Date();
    dateMade.setMonth(dateMade.getMonth() - 10);
    const response = await (0, supertest_1.default)(app_1.app)
        .post('/api/comments')
        .set('Cookie', cookie)
        .send({
        comment,
        mealId: meal.id,
        dateMade: new Date(),
    })
        .expect(201);
    const updateOne = await (0, supertest_1.default)(app_1.app)
        .put(`/api/comments/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
        comment: updatedComment,
        dateMade: response.body.dateMade,
    })
        .expect(200);
    expect(updateOne.body.comment).toEqual(updatedComment);
    expect(updateOne.body.dateMade).toEqual(response.body.dateMade);
    const updateTwo = await (0, supertest_1.default)(app_1.app)
        .put(`/api/comments/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
        comment,
        dateMade,
    })
        .expect(200);
    expect(updateTwo.body.comment).toEqual(comment);
    expect(updateTwo.body.dateMade).toEqual(dateMade.toISOString());
    expect(updateTwo.body.dateMade).not.toEqual(response.body.dateMade);
});

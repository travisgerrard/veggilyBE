"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
it('returns the ingredients for a given meal', async () => {
    const cookie = global.signin();
    const mealTitle = 'Tofu bake';
    const response = await (0, supertest_1.default)(app_1.app)
        .post(`/api/meals/`)
        .set('Cookie', cookie)
        .send({
        title: mealTitle,
    });
    const meal = { id: response.body.id };
    const titleOne = 'titleOne';
    const titleTwo = 'titleTwo';
    const titleThree = 'titleThree';
    await (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', cookie)
        .send({
        title: titleOne,
        mealId: meal.id,
    })
        .expect(201);
    await (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', cookie)
        .send({
        title: titleTwo,
        mealId: meal.id,
    })
        .expect(201);
    await (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', cookie)
        .send({
        title: titleThree,
    })
        .expect(201);
    const ingredientResponse = await (0, supertest_1.default)(app_1.app)
        .get(`/api/ingredients/meal/${meal.id}`)
        .send()
        .expect(200);
    expect(ingredientResponse.body.length).toEqual(2);
});

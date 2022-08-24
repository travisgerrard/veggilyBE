"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
it('adds ingredient to list', async () => {
    const cookie = global.signin();
    const mealTitle = 'Tofu bake';
    const createMeal = await (0, supertest_1.default)(app_1.app)
        .post(`/api/meals/`)
        .set('Cookie', cookie)
        .send({
        title: mealTitle,
    });
    const title = 'ingredient test';
    const createIngredient = await (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', cookie)
        .send({
        title,
        mealId: createMeal.body.id,
    })
        .expect(201);
    await (0, supertest_1.default)(app_1.app)
        .post(`/api/ingredients/addIngredientToList/${createIngredient.body.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200);
    await (0, supertest_1.default)(app_1.app)
        .post(`/api/ingredients/addIngredientToList/${createIngredient.body.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200);
    const allLists = await (0, supertest_1.default)(app_1.app)
        .get('/api/lists')
        .set('Cookie', cookie)
        .send({});
    expect(allLists.body.length).toEqual(2);
    expect(allLists.body[0].meal).toEqual(createMeal.body.id);
    expect(allLists.body[1].meal).toEqual(createMeal.body.id);
});

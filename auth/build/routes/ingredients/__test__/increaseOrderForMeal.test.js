"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const ingredient_1 = require("../../../models/ingredient");
// import { natsWrapper } from '../../nats-wrapper';
it('creates an ingredient with valid input linked to a meal, and increases order accordingly', async () => {
    const cookie = global.signin();
    const mealTitle = 'Tofu bake';
    const response = await (0, supertest_1.default)(app_1.app)
        .post(`/api/meals/`)
        .set('Cookie', cookie)
        .send({
        title: mealTitle,
    });
    const meal = { id: response.body.id };
    let ingredients = await ingredient_1.Ingredient.find({});
    expect(ingredients.length).toEqual(0);
    const title = 'asldkfj';
    // 0
    const ingredientZero = await (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', cookie)
        .send({
        title,
        mealId: meal.id,
    })
        .expect(201);
    // 1
    const ingredientOne = await (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', cookie)
        .send({
        title,
        mealId: meal.id,
    })
        .expect(201);
    // 2
    const ingredientTwo = await (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', cookie)
        .send({
        title,
        mealId: meal.id,
    })
        .expect(201);
    // 3
    const ingredientThree = await (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', cookie)
        .send({
        title,
        mealId: meal.id,
    })
        .expect(201);
    ingredients = await ingredient_1.Ingredient.find({}).populate('meal').sort('orderNumber');
    expect(ingredients.length).toEqual(4);
    expect(ingredients[0].title).toEqual(title);
    expect(ingredients[0].meal.title).toEqual(mealTitle);
    expect(ingredients[0].orderNumber).toEqual(0);
    expect(ingredients[1].orderNumber).toEqual(1);
    expect(ingredients[2].orderNumber).toEqual(2);
    expect(ingredients[3].orderNumber).toEqual(3);
    expect(ingredients[3].id).toEqual(ingredientThree.body.id);
    await (0, supertest_1.default)(app_1.app)
        .put(`/api/ingredients/increase/${ingredientZero.body.id}`)
        .set('Cookie', cookie)
        .send({})
        .expect(200);
    ingredients = await ingredient_1.Ingredient.find({}).populate('meal').sort('orderNumber');
    expect(ingredients[1].id).toEqual(ingredientZero.body.id);
});
it('creates an ingredient with valid input linked to a meal, but cannot increase order number if order number last one in list', async () => {
    const cookie = global.signin();
    const mealTitle = 'Tofu bake';
    const response = await (0, supertest_1.default)(app_1.app)
        .post(`/api/meals/`)
        .set('Cookie', cookie)
        .send({
        title: mealTitle,
    });
    const meal = { id: response.body.id };
    let ingredients = await ingredient_1.Ingredient.find({});
    expect(ingredients.length).toEqual(0);
    const title = 'asldkfj';
    // 0
    const ingredientZero = await (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', cookie)
        .send({
        title,
        mealId: meal.id,
    })
        .expect(201);
    // 1
    const ingredientOne = await (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', cookie)
        .send({
        title,
        mealId: meal.id,
    })
        .expect(201);
    // 2
    const ingredientTwo = await (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', cookie)
        .send({
        title,
        mealId: meal.id,
    })
        .expect(201);
    // 3
    const ingredientThree = await (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', cookie)
        .send({
        title,
        mealId: meal.id,
    })
        .expect(201);
    ingredients = await ingredient_1.Ingredient.find({}).populate('meal').sort('orderNumber');
    expect(ingredients.length).toEqual(4);
    expect(ingredients[0].title).toEqual(title);
    expect(ingredients[0].meal.title).toEqual(mealTitle);
    expect(ingredients[0].orderNumber).toEqual(0);
    expect(ingredients[1].orderNumber).toEqual(1);
    expect(ingredients[2].orderNumber).toEqual(2);
    expect(ingredients[3].orderNumber).toEqual(3);
    expect(ingredients[3].id).toEqual(ingredientThree.body.id);
    await (0, supertest_1.default)(app_1.app)
        .put(`/api/ingredients/increase/${ingredientThree.body.id}`)
        .set('Cookie', cookie)
        .send({})
        .expect(400);
});

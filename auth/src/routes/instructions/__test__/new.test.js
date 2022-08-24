"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const instruction_1 = require("../../../models/instruction");
it('has a route handler listening to /api/ingredients for post requests', async () => {
    const response = await (0, supertest_1.default)(app_1.app).post('/api/ingredients').send({});
    expect(response.status).not.toEqual(400);
});
it('cannot be accessed if the user is not signed in', async () => {
    await (0, supertest_1.default)(app_1.app).post('/api/ingredients').send({}).expect(401);
});
it('can be accessed if the user is signed in', async () => {
    const response = await (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', global.signin())
        .send({});
    expect(response.status).not.toEqual(401);
});
it('returns an error if an invalid text is provided', async () => {
    await (0, supertest_1.default)(app_1.app)
        .post('/api/instructions')
        .set('Cookie', global.signin())
        .send({
        text: '',
    })
        .expect(400);
    await (0, supertest_1.default)(app_1.app)
        .post('/api/instructions')
        .set('Cookie', global.signin())
        .send({})
        .expect(400);
});
it('creates a ingredient with valid input', async () => {
    let instructions = await instruction_1.Instruction.find({});
    expect(instructions.length).toEqual(0);
    const text = 'asldkfj';
    await (0, supertest_1.default)(app_1.app)
        .post('/api/instructions')
        .set('Cookie', global.signin())
        .send({
        text,
    })
        .expect(201);
    instructions = await instruction_1.Instruction.find({});
    expect(instructions.length).toEqual(1);
    expect(instructions[0].text).toEqual(text);
    expect(instructions[0].orderNumber).toEqual(0);
});
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
    let instructions = await instruction_1.Instruction.find({});
    expect(instructions.length).toEqual(0);
    const text = 'asldkfj';
    // 1
    await (0, supertest_1.default)(app_1.app)
        .post('/api/instructions')
        .set('Cookie', global.signin())
        .send({
        text,
        mealId: meal.id,
    })
        .expect(201);
    // 2
    await (0, supertest_1.default)(app_1.app)
        .post('/api/instructions')
        .set('Cookie', global.signin())
        .send({
        text,
        mealId: meal.id,
    })
        .expect(201);
    // 3
    await (0, supertest_1.default)(app_1.app)
        .post('/api/instructions')
        .set('Cookie', global.signin())
        .send({
        text,
        mealId: meal.id,
    })
        .expect(201);
    // 4
    await (0, supertest_1.default)(app_1.app)
        .post('/api/instructions')
        .set('Cookie', global.signin())
        .send({
        text,
        mealId: meal.id,
    })
        .expect(201);
    instructions = await instruction_1.Instruction.find({}).populate('meal');
    expect(instructions.length).toEqual(4);
    expect(instructions[0].text).toEqual(text);
    expect(instructions[0].meal.title).toEqual(mealTitle);
    expect(instructions[0].orderNumber).toEqual(0);
    expect(instructions[1].orderNumber).toEqual(1);
    expect(instructions[2].orderNumber).toEqual(2);
    expect(instructions[3].orderNumber).toEqual(3);
});

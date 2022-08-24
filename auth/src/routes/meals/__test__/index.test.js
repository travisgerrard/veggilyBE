"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const createMeal = () => {
    const title = 'asdfasdfdf';
    return (0, supertest_1.default)(app_1.app).post('/api/meals').set('Cookie', global.signin()).send({
        title,
    });
};
it('can fetch a list of meals', async () => {
    await createMeal();
    await createMeal();
    await createMeal();
    const response = await (0, supertest_1.default)(app_1.app).get('/api/meals').send().expect(200);
    expect(response.body.length).toEqual(3);
});

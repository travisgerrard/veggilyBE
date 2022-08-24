"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const createIngredient = () => {
    const title = 'asdfasdfdf';
    return (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', global.signin())
        .send({
        title,
    });
};
it('can fetch a list of tickets', async () => {
    await createIngredient();
    await createIngredient();
    await createIngredient();
    const response = await (0, supertest_1.default)(app_1.app)
        .get('/api/ingredients')
        .send()
        .expect(200);
    expect(response.body.length).toEqual(3);
});

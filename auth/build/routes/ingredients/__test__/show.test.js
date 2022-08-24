"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const mongoose_1 = __importDefault(require("mongoose"));
it('returns a 404 if the ingredient is not found', async () => {
    const id = new mongoose_1.default.Types.ObjectId().toHexString();
    await (0, supertest_1.default)(app_1.app).get(`/api/ingredients/${id}`).send().expect(404);
});
it('returns the ingredient if the ingredient is found', async () => {
    const title = 'asldkfj';
    const response = await (0, supertest_1.default)(app_1.app)
        .post('/api/ingredients')
        .set('Cookie', global.signin())
        .send({
        title,
    })
        .expect(201);
    const ingredientResponse = await (0, supertest_1.default)(app_1.app)
        .get(`/api/ingredients/${response.body.id}`)
        .send()
        .expect(200);
    expect(ingredientResponse.body.title).toEqual(title);
});

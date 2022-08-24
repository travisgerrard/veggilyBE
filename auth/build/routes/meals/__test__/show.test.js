"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const mongoose_1 = __importDefault(require("mongoose"));
it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose_1.default.Types.ObjectId().toHexString();
    await (0, supertest_1.default)(app_1.app).get(`/api/meals/${id}`).send().expect(404);
});
it('returns the meal if the meal is found', async () => {
    const title = 'asldkfj';
    const response = await (0, supertest_1.default)(app_1.app)
        .post('/api/meals')
        .set('Cookie', global.signin())
        .send({
        title,
    })
        .expect(201);
    const mealResponse = await (0, supertest_1.default)(app_1.app)
        .get(`/api/meals/${response.body.id}`)
        .send()
        .expect(200);
    expect(mealResponse.body.title).toEqual(title);
});

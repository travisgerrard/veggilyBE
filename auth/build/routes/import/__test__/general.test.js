"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
it('can be accessed if the user is signed in', async () => {
    const url = 'https://minimalistbaker.com/chickpea-shawarma-salad/';
    const response = await (0, supertest_1.default)(app_1.app)
        .post(`/api/general`)
        .set('Cookie', global.signin())
        .send({
        url,
    });
    console.log(response.body);
    expect(response.status).not.toEqual(401);
});

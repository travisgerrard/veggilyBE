"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
it('fails when an email that does not exsit is supplied', async () => {
    return (0, supertest_1.default)(app_1.app)
        .post('/api/users/signin')
        .send({
        email: 'test@test.com',
        password: 'password',
    })
        .expect(400);
});
it('fails when an incorrect password is supplied', async () => {
    await (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'test@test.com',
        password: 'password',
    })
        .expect(201);
    await (0, supertest_1.default)(app_1.app)
        .post('/api/users/signin')
        .send({
        email: 'test@test.com',
        password: 'asdf',
    })
        .expect(400);
});
it('responds with cookie when given valid credentials', async () => {
    await (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'test@test.com',
        password: 'password',
    })
        .expect(201);
    const response = await (0, supertest_1.default)(app_1.app)
        .post('/api/users/signin')
        .send({
        email: 'test@test.com',
        password: 'password',
    })
        .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
});

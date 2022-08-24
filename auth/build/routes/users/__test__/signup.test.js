"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
it('returns a 201 on successful signup', async () => {
    return (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'test@test.com',
        password: 'password',
    })
        .expect(201);
});
it('returns a 400 with an invalid email', async () => {
    return (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'testbademail',
        password: 'password',
    })
        .expect(400);
});
it('returns a 400 with an invalid password', async () => {
    return (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'test@test.com',
        password: 'p',
    })
        .expect(400);
});
it('returns a 400 with an invalid missing email and password', async () => {
    await (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'test@test.com',
    })
        .expect(400);
    return (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        password: 'password',
    })
        .expect(400);
});
it('disallows duplicate emails', async () => {
    await (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'test@test.com',
        password: 'password',
    })
        .expect(201);
    return (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'test@test.com',
        password: 'password',
    })
        .expect(400);
});
it('sets a cookie after successful signup', async () => {
    const response = await (0, supertest_1.default)(app_1.app)
        .post('/api/users/signup')
        .send({
        email: 'test@test.com',
        password: 'password',
    })
        .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined;
});

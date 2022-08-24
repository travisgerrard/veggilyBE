"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("../../../app");
const common_1 = require("@tgticketing/common");
const list_1 = require("../../../models/list");
it('has a route handler listening to /api/lists for get requests', async () => {
    const response = await (0, supertest_1.default)(app_1.app).get('/api/lists').send({});
    expect(response.status).not.toEqual(400);
});
it('returns list items', async () => {
    const userId = new mongoose_1.default.Types.ObjectId().toHexString();
    let meal;
    const listOne = list_1.List.build({
        title: 'List One',
        ingredientType: common_1.IngredientType.None,
        meal,
        creatorId: userId,
        isCompleted: false,
    });
    await listOne.save();
    const listTwo = list_1.List.build({
        title: 'List One',
        ingredientType: common_1.IngredientType.None,
        meal,
        creatorId: userId,
        isCompleted: false,
    });
    await listTwo.save();
    const allLists = await (0, supertest_1.default)(app_1.app)
        .get('/api/lists')
        .set('Cookie', global.signin(userId))
        .send({});
    expect(allLists.body.length).toEqual(2);
});

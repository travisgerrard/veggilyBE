"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("../../../app");
const list_1 = require("../../../models/list");
const common_1 = require("@tgticketing/common");
it('deletes a list item', async () => {
    const userId = new mongoose_1.default.Types.ObjectId().toHexString();
    let meal;
    const list = list_1.List.build({
        title: 'List One',
        ingredientType: common_1.IngredientType.None,
        meal,
        creatorId: userId,
        isCompleted: false,
    });
    await list.save();
    await (0, supertest_1.default)(app_1.app)
        .delete(`/api/lists/${list.id}`)
        .set('Cookie', global.signin(userId))
        .send({});
    const allLists = await (0, supertest_1.default)(app_1.app)
        .get('/api/lists')
        .set('Cookie', global.signin(userId))
        .send({});
    expect(allLists.body.length).toEqual(0);
});

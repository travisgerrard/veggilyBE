"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("../../../app");
const plan_1 = require("../../../models/plan");
const meal_1 = require("../../../models/meal");
it('deletes a plan item', async () => {
    const userId = new mongoose_1.default.Types.ObjectId().toHexString();
    const cookie = global.signin();
    const mealTitle = 'Tofu bake';
    const response = await (0, supertest_1.default)(app_1.app)
        .post(`/api/meals/`)
        .set('Cookie', cookie)
        .send({
        title: mealTitle,
    });
    const meal = await meal_1.Meal.findById(response.body.id);
    const plan = plan_1.Plan.build({
        meal: meal,
        datePlanToMake: new Date(),
        creatorId: userId,
        isCompleted: false,
    });
    await plan.save();
    await (0, supertest_1.default)(app_1.app)
        .delete(`/api/plans/${plan.id}`)
        .set('Cookie', global.signin(userId))
        .send({});
    const allLists = await (0, supertest_1.default)(app_1.app)
        .get('/api/plans')
        .set('Cookie', global.signin(userId))
        .send({});
    expect(allLists.body.length).toEqual(0);
});

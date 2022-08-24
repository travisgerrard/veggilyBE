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
it('toggles a plan item', async () => {
    const userId = new mongoose_1.default.Types.ObjectId().toHexString();
    const cookie = global.signin();
    const mealTitle = 'Tofu bake';
    const createMeal = await (0, supertest_1.default)(app_1.app)
        .post(`/api/meals/`)
        .set('Cookie', cookie)
        .send({
        title: mealTitle,
    });
    const meal = await meal_1.Meal.findById(createMeal.body.id);
    const plan = plan_1.Plan.build({
        meal: meal,
        datePlanToMake: new Date(),
        creatorId: userId,
        isCompleted: false,
    });
    await plan.save();
    const response = await (0, supertest_1.default)(app_1.app)
        .put(`/api/plans/toggle/${plan.id}`)
        .set('Cookie', global.signin(userId))
        .send({});
    expect(response.body.isCompleted).toEqual(true);
    const responseTwo = await (0, supertest_1.default)(app_1.app)
        .put(`/api/plans/toggle/${plan.id}`)
        .set('Cookie', global.signin(userId))
        .send({});
    expect(responseTwo.body.isCompleted).toEqual(false);
});

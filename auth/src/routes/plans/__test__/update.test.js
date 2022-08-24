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
it('updates a plan', async () => {
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
    const nowDate = new Date();
    const plan = plan_1.Plan.build({
        meal: meal,
        datePlanToMake: nowDate,
        creatorId: userId,
        isCompleted: false,
    });
    await plan.save();
    const updateDatePlanToMake = new Date();
    updateDatePlanToMake.setMonth(updateDatePlanToMake.getMonth() - 10);
    const response = await (0, supertest_1.default)(app_1.app)
        .put(`/api/plans/update/${plan.id}`)
        .set('Cookie', global.signin(userId))
        .send({
        datePlanToMake: updateDatePlanToMake,
    });
    expect(response.body.datePlanToMake).toEqual(updateDatePlanToMake.toISOString());
    expect(response.body.datePlanToMake).not.toEqual(nowDate.toISOString());
});

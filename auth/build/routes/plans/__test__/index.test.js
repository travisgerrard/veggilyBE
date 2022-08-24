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
const common_1 = require("@tgticketing/common");
const list_1 = require("../../../models/list");
it('has a route handler planening to /api/plans for get requests', async () => {
    const response = await (0, supertest_1.default)(app_1.app).get('/api/plans').send({});
    expect(response.status).not.toEqual(400);
});
it('returns plan items', async () => {
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
    const listOne = list_1.List.build({
        title: 'List One',
        ingredientType: common_1.IngredientType.None,
        meal: meal,
        creatorId: userId,
        isCompleted: false,
    });
    await listOne.save();
    const planOne = plan_1.Plan.build({
        meal: meal,
        datePlanToMake: new Date(),
        creatorId: userId,
        isCompleted: false,
    });
    await planOne.save();
    const planTwo = plan_1.Plan.build({
        meal: meal,
        datePlanToMake: new Date(),
        creatorId: userId,
        isCompleted: false,
    });
    await planTwo.save();
    const allPlans = await (0, supertest_1.default)(app_1.app)
        .get('/api/plans')
        .set('Cookie', global.signin(userId))
        .send({});
    console.log(allPlans.body);
    console.log(allPlans.body[0].ingredients);
    expect(allPlans.body.length).toEqual(2);
});

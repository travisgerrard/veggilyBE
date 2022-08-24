"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMealToPlanRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@tgticketing/common");
// import { natsWrapper } from '../nats-wrapper';
const meal_1 = require("../../models/meal");
const plan_1 = require("../../models/plan");
const router = express_1.default.Router();
exports.addMealToPlanRouter = router;
router.post('/api/meals/addMealToPlan/:id', common_1.requireAuth, async (req, res) => {
    const meal = await meal_1.Meal.findById(req.params.id);
    if (!meal) {
        throw new common_1.NotFoundError();
    }
    const plan = plan_1.Plan.build({
        meal: meal,
        creatorId: req.currentUser.id,
        datePlanToMake: new Date(),
        isCompleted: false,
    });
    await plan.save();
    res.send(meal);
});

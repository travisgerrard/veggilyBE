"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMealRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const common_1 = require("@tgticketing/common");
const meal_1 = require("../../models/meal");
// import { MealUpdatedPublisher } from '../events/publishers/meal-updated-publisher';
// import { natsWrapper } from '../nats-wrapper';
const router = express_1.default.Router();
exports.updateMealRouter = router;
router.put('/api/meals/:id', common_1.requireAuth, [(0, express_validator_1.body)('title').not().isEmpty().withMessage('Title is required')], common_1.validateRequest, async (req, res) => {
    const { title, whereToFind, mealType } = req.body;
    const meal = await meal_1.Meal.findById(req.params.id);
    if (!meal) {
        throw new common_1.NotFoundError();
    }
    if (meal.creatorId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    meal.set({
        title: title || meal.title,
        whereToFind: whereToFind || meal.whereToFind,
        mealType,
    });
    await meal.save();
    // new MealUpdatedPublisher(natsWrapper.client).publish({
    //   id: meal.id,
    //   version: meal.version,
    //   title: meal.title,
    // });
    res.send(meal);
});

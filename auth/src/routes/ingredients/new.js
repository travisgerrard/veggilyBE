"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIngredientRouter = void 0;
const common_1 = require("@tgticketing/common");
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
// import { IngredientCreatedPublisher } from '../events/publishers/ingredient-created-publisher';
const ingredient_1 = require("../../models/ingredient");
const meal_1 = require("../../models/meal");
// import { natsWrapper } from '../nats-wrapper';
const router = express_1.default.Router();
exports.createIngredientRouter = router;
router.post('/api/ingredients', common_1.requireAuth, [(0, express_validator_1.body)('title').not().isEmpty().withMessage('Title is required')], common_1.validateRequest, async (req, res) => {
    const { title, ingredientType, imageUrl, mealId } = req.body;
    // If meal is associated with an ingredient, find the meal it is associated with
    let meal;
    let orderNumber = 0;
    if (mealId) {
        meal = await meal_1.Meal.findById(mealId);
        orderNumber = (await ingredient_1.Ingredient.find({ meal: mealId })).length;
        // if (!meal) {
        //   throw new NotFoundError();
        // }
    }
    // buld ingrednet and save to the database
    const ingredient = ingredient_1.Ingredient.build({
        title,
        ingredientType,
        imageUrl,
        creatorId: req.currentUser.id,
        orderNumber,
        meal,
    });
    await ingredient.save();
    // new IngredientCreatedPublisher(natsWrapper.client).publish({
    //   id: ingredient.id,
    //   version: ingredient.version,
    //   title: ingredient.title,
    //   meal: ingredient.meal?.id,
    //   ingredientType: ingredient.ingredientType,
    // });
    res.status(201).send(ingredient);
});

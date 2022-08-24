"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIngredientRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const common_1 = require("@tgticketing/common");
const ingredient_1 = require("../../models/ingredient");
// import { IngredientUpdatedPublisher } from '../events/publishers/ingredient-updated-publisher';
// import { natsWrapper } from '../nats-wrapper';
const router = express_1.default.Router();
exports.updateIngredientRouter = router;
router.put('/api/ingredients/:id', common_1.requireAuth, [(0, express_validator_1.body)('title').not().isEmpty().withMessage('Title is required')], common_1.validateRequest, async (req, res) => {
    const { title, ingredientType, imageUrl, mealId } = req.body;
    const ingredient = await ingredient_1.Ingredient.findById(req.params.id);
    if (!ingredient) {
        throw new common_1.NotFoundError();
    }
    if (ingredient.creatorId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    ingredient.set({
        title,
        imageUrl,
        ingredientType,
    });
    await ingredient.save();
    // new IngredientUpdatedPublisher(natsWrapper.client).publish({
    //   id: ingredient.id,
    //   version: ingredient.version,
    //   title: ingredient.title,
    //   meal: ingredient.meal?.id,
    //   ingredientType: ingredient.ingredientType,
    // });
    res.send(ingredient);
});

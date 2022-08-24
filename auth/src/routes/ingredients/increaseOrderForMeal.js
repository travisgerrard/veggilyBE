"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.increaseIngredientOrderRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@tgticketing/common");
const ingredient_1 = require("../../models/ingredient");
const router = express_1.default.Router();
exports.increaseIngredientOrderRouter = router;
router.put('/api/ingredients/increase/:id', common_1.requireAuth, common_1.validateRequest, async (req, res) => {
    const ingredient = await ingredient_1.Ingredient.findById(req.params.id).populate('meal');
    if (!ingredient || !ingredient.meal.id) {
        throw new common_1.NotFoundError();
    }
    if (ingredient.creatorId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    const maxOrderNumber = (await ingredient_1.Ingredient.find({ meal: ingredient.meal.id }))
        .length;
    if (ingredient.orderNumber === maxOrderNumber - 1) {
        throw new common_1.BadRequestError('Already the last item in the list');
    }
    const ingredients = await ingredient_1.Ingredient.find({
        meal: ingredient.meal.id,
    }).sort('orderNumber');
    const ingredientToSwitchWith = ingredients[ingredient.orderNumber + 1];
    ingredientToSwitchWith.set({
        orderNumber: ingredient.orderNumber,
    });
    await ingredientToSwitchWith.save();
    ingredient.set({
        orderNumber: ingredient.orderNumber + 1,
    });
    await ingredient.save();
    res.send(ingredient);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIngredientRouter = void 0;
const common_1 = require("@tgticketing/common");
const express_1 = __importDefault(require("express"));
const ingredient_1 = require("../../models/ingredient");
const router = express_1.default.Router();
exports.deleteIngredientRouter = router;
router.delete('/api/ingredients/:ingredientId', common_1.requireAuth, async (req, res) => {
    const { ingredientId } = req.params;
    const ingredient = await ingredient_1.Ingredient.findById(ingredientId).populate('meal');
    if (!ingredient) {
        throw new common_1.NotFoundError();
    }
    if (ingredient.creatorId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    // Update ordernumbers when item is deleated
    if (ingredient.meal) {
        const ingredients = await ingredient_1.Ingredient.find({ meal: ingredient.meal.id });
        ingredients.forEach(async (ingredientItem) => {
            if (ingredientItem.orderNumber > ingredient.orderNumber) {
                ingredientItem.set({
                    orderNumber: ingredientItem.orderNumber - 1,
                });
                await ingredientItem.save();
            }
        });
    }
    await ingredient.remove();
    res.status(204).send(ingredient);
});

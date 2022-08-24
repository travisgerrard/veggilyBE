"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showIngredientsForMealRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@tgticketing/common");
const ingredient_1 = require("../../models/ingredient");
const router = express_1.default.Router();
exports.showIngredientsForMealRouter = router;
router.get('/api/ingredients/meal/:id', async (req, res) => {
    const ingredients = await ingredient_1.Ingredient.find({ meal: req.params.id }).sort('orderNumber');
    if (!ingredients) {
        throw new common_1.NotFoundError();
    }
    res.send(ingredients);
});

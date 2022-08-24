"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexIngredientRouter = void 0;
const express_1 = __importDefault(require("express"));
const ingredient_1 = require("../../models/ingredient");
const router = express_1.default.Router();
exports.indexIngredientRouter = router;
router.get('/api/ingredients', async (req, res) => {
    const ingredients = await ingredient_1.Ingredient.find();
    res.send(ingredients);
});

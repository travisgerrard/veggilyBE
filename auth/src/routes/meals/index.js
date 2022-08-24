"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexMealRouter = void 0;
const express_1 = __importDefault(require("express"));
const meal_1 = require("../../models/meal");
const router = express_1.default.Router();
exports.indexMealRouter = router;
router.get('/api/meals', async (req, res) => {
    const meals = await meal_1.Meal.find();
    res.send(meals);
});

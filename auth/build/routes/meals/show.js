"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showMealRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@tgticketing/common");
const meal_1 = require("../../models/meal");
const router = express_1.default.Router();
exports.showMealRouter = router;
router.get('/api/meals/:id', async (req, res) => {
    const meal = await meal_1.Meal.findById(req.params.id);
    if (!meal) {
        throw new common_1.NotFoundError();
    }
    res.send(meal);
});

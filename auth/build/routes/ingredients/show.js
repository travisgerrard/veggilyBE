"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showIngredientRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@tgticketing/common");
const ingredient_1 = require("../../models/ingredient");
const router = express_1.default.Router();
exports.showIngredientRouter = router;
router.get('/api/ingredients/:id', async (req, res) => {
    const ingredient = await ingredient_1.Ingredient.findById(req.params.id);
    if (!ingredient) {
        throw new common_1.NotFoundError();
    }
    res.send(ingredient);
});

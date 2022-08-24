"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addIngredientToListRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@tgticketing/common");
const ingredient_1 = require("../../models/ingredient");
const list_1 = require("../../models/list");
// import { natsWrapper } from '../nats-wrapper';
// import { IngredientAddedToListPublisher } from '../events/publishers/ingredient-addto-list-publisher';
const router = express_1.default.Router();
exports.addIngredientToListRouter = router;
router.post('/api/ingredients/addIngredientToList/:id', common_1.requireAuth, async (req, res) => {
    var _a;
    const ingredient = await ingredient_1.Ingredient.findById(req.params.id).populate('meal');
    if (!ingredient) {
        throw new common_1.NotFoundError();
    }
    const list = list_1.List.build({
        title: ingredient.title,
        ingredientType: ingredient.ingredientType,
        meal: (_a = ingredient.meal) === null || _a === void 0 ? void 0 : _a.id,
        creatorId: req.currentUser.id,
        isCompleted: false,
    });
    await list.save();
    res.send(ingredient);
});

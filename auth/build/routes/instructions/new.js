"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInstructionRouter = void 0;
const common_1 = require("@tgticketing/common");
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const instruction_1 = require("../../models/instruction");
const meal_1 = require("../../models/meal");
const router = express_1.default.Router();
exports.createInstructionRouter = router;
router.post('/api/instructions', common_1.requireAuth, [(0, express_validator_1.body)('text').not().isEmpty().withMessage('Cannot be blank')], common_1.validateRequest, async (req, res) => {
    const { text, bold, mealId } = req.body;
    // If meal is associated with an ingredient, find the meal it is associated with
    let meal;
    let orderNumber = 0;
    if (mealId) {
        meal = await meal_1.Meal.findById(mealId);
        orderNumber = (await instruction_1.Instruction.find({ meal: mealId })).length;
        // if (!meal) {
        //   throw new NotFoundError();
        // }
    }
    // buld ingrednet and save to the database
    const instruction = instruction_1.Instruction.build({
        text,
        bold,
        creatorId: req.currentUser.id,
        orderNumber,
        meal,
    });
    await instruction.save();
    res.status(201).send(instruction);
});

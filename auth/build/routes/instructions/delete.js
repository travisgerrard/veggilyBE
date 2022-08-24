"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInstructionRouter = void 0;
const common_1 = require("@tgticketing/common");
const express_1 = __importDefault(require("express"));
const instruction_1 = require("../../models/instruction");
const router = express_1.default.Router();
exports.deleteInstructionRouter = router;
router.delete('/api/instructions/:instructionId', common_1.requireAuth, async (req, res) => {
    const { instructionId } = req.params;
    const instruction = await instruction_1.Instruction.findById(instructionId).populate('meal');
    if (!instruction) {
        throw new common_1.NotFoundError();
    }
    if (instruction.creatorId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    // Update ordernumbers when item is deleated
    if (instruction.meal) {
        const instructions = await instruction_1.Instruction.find({
            meal: instruction.meal.id,
        });
        instructions.forEach(async (instructionItem) => {
            if (instructionItem.orderNumber > instruction.orderNumber) {
                instructionItem.set({
                    orderNumber: instructionItem.orderNumber - 1,
                });
                await instructionItem.save();
            }
        });
    }
    await instruction.remove();
    res.status(204).send(instruction);
});

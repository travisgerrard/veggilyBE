"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.increaseInstructionOrderRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@tgticketing/common");
const instruction_1 = require("../../models/instruction");
const router = express_1.default.Router();
exports.increaseInstructionOrderRouter = router;
router.put('/api/instructions/increase/:id', common_1.requireAuth, common_1.validateRequest, async (req, res) => {
    const instruction = await instruction_1.Instruction.findById(req.params.id).populate('meal');
    if (!instruction || !instruction.meal.id) {
        throw new common_1.NotFoundError();
    }
    if (instruction.creatorId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    const maxOrderNumber = (await instruction_1.Instruction.find({ meal: instruction.meal.id })).length;
    if (instruction.orderNumber === maxOrderNumber - 1) {
        throw new common_1.BadRequestError('Already the last item in the list');
    }
    const instructions = await instruction_1.Instruction.find({
        meal: instruction.meal.id,
    }).sort('orderNumber');
    const instructionToSwitchWith = instructions[instruction.orderNumber + 1];
    instructionToSwitchWith.set({
        orderNumber: instruction.orderNumber,
    });
    await instructionToSwitchWith.save();
    instruction.set({
        orderNumber: instruction.orderNumber + 1,
    });
    await instruction.save();
    res.send(instruction);
});

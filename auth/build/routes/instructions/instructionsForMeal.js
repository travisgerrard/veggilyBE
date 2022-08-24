"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showInstructionsForMealRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@tgticketing/common");
const instruction_1 = require("../../models/instruction");
const router = express_1.default.Router();
exports.showInstructionsForMealRouter = router;
router.get('/api/instructions/meal/:id', async (req, res) => {
    const instructions = await instruction_1.Instruction.find({ meal: req.params.id }).sort('orderNumber');
    if (!instructions) {
        throw new common_1.NotFoundError();
    }
    res.send(instructions);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexInstructionRouter = void 0;
const express_1 = __importDefault(require("express"));
const instruction_1 = require("../../models/instruction");
const router = express_1.default.Router();
exports.indexInstructionRouter = router;
router.get('/api/instructions', async (req, res) => {
    const instructions = await instruction_1.Instruction.find();
    res.send(instructions);
});

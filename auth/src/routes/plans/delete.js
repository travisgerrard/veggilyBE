"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlanRouter = void 0;
const common_1 = require("@tgticketing/common");
const express_1 = __importDefault(require("express"));
const plan_1 = require("../../models/plan");
const router = express_1.default.Router();
exports.deletePlanRouter = router;
router.delete('/api/plans/:id', common_1.requireAuth, async (req, res) => {
    const plan = await plan_1.Plan.findById(req.params.id);
    if (!plan) {
        throw new common_1.NotFoundError();
    }
    if (plan.creatorId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    await plan.remove();
    res.send(plan);
});

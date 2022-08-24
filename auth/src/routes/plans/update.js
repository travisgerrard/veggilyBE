"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlanRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const common_1 = require("@tgticketing/common");
const plan_1 = require("../../models/plan");
const router = express_1.default.Router();
exports.updatePlanRouter = router;
router.put('/api/plans/update/:id', common_1.requireAuth, [(0, express_validator_1.body)('datePlanToMake').not().isEmpty().withMessage('date is required')], common_1.validateRequest, async (req, res) => {
    const { datePlanToMake } = req.body;
    const plan = await plan_1.Plan.findById(req.params.id);
    if (!plan) {
        throw new common_1.NotFoundError();
    }
    if (plan.creatorId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    plan.set({
        datePlanToMake,
    });
    await plan.save();
    res.send(plan);
});

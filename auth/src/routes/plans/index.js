"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexPlanRouter = void 0;
const express_1 = __importDefault(require("express"));
const plan_1 = require("../../models/plan");
const router = express_1.default.Router();
exports.indexPlanRouter = router;
router.get('/api/plans', async (req, res) => {
    if (!req.currentUser) {
        return res.send([
            {
                id: '12345',
                title: 'Need to sign in to see your meal plan',
            },
        ]);
    }
    const plans = await plan_1.Plan.find({ creatorId: req.currentUser.id })
        .populate('meal')
        .populate('ingredients');
    res.send(plans);
});

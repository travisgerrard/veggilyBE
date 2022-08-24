"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentRouter = void 0;
const common_1 = require("@tgticketing/common");
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const comment_1 = require("../../models/comment");
const router = express_1.default.Router();
exports.createCommentRouter = router;
router.post('/api/comments', common_1.requireAuth, [
    (0, express_validator_1.body)('comment').not().isEmpty().withMessage('Comment is required'),
    (0, express_validator_1.body)('dateMade').not().isEmpty().withMessage('date is required'),
], common_1.validateRequest, async (req, res) => {
    const { comment, imageUrl, mealId, dateMade } = req.body;
    if (!mealId) {
        throw new common_1.BadRequestError('Needs to be attahced to a meal');
    }
    // buld comment and save to the database
    const newComment = comment_1.Comment.build({
        comment,
        imageUrl,
        creatorId: req.currentUser.id,
        dateMade,
        meal: mealId,
    });
    await newComment.save();
    res.status(201).send(newComment);
});

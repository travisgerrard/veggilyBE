"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const common_1 = require("@tgticketing/common");
const comment_1 = require("../../models/comment");
const router = express_1.default.Router();
exports.updateCommentRouter = router;
router.put('/api/comments/:id', common_1.requireAuth, [
    (0, express_validator_1.body)('comment').not().isEmpty().withMessage('Comment is required'),
    (0, express_validator_1.body)('dateMade').not().isEmpty().withMessage('date is required'),
], common_1.validateRequest, async (req, res) => {
    const { comment: newComment, dateMade } = req.body;
    const comment = await comment_1.Comment.findById(req.params.id);
    if (!comment) {
        throw new common_1.NotFoundError();
    }
    if (comment.creatorId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    comment.set({
        comment: newComment,
        dateMade,
    });
    await comment.save();
    res.send(comment);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentRouter = void 0;
const common_1 = require("@tgticketing/common");
const express_1 = __importDefault(require("express"));
const comment_1 = require("../../models/comment");
const router = express_1.default.Router();
exports.deleteCommentRouter = router;
router.delete('/api/comments/:commentId', common_1.requireAuth, async (req, res) => {
    const { commentId } = req.params;
    const comment = await comment_1.Comment.findById(commentId);
    if (!comment) {
        throw new common_1.NotFoundError();
    }
    if (comment.creatorId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    await comment.remove();
    res.status(204).send(comment);
});

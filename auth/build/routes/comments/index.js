"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexCommentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const comment_1 = require("../../models/comment");
const router = express_1.default.Router();
exports.indexCommentsRouter = router;
router.get('/api/comments/meal/:id', async (req, res) => {
    if (!req.currentUser) {
        return res.send([
            {
                id: '12345',
                comment: 'Need to sign in to see comment',
                date: new Date(),
            },
        ]);
    }
    const comments = await comment_1.Comment.find({
        meal: req.params.id,
        creatorId: req.currentUser.id,
    });
    res.send(comments);
});

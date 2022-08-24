"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteListRouter = void 0;
const common_1 = require("@tgticketing/common");
const express_1 = __importDefault(require("express"));
const list_1 = require("../../models/list");
const router = express_1.default.Router();
exports.deleteListRouter = router;
router.delete('/api/lists/:id', common_1.requireAuth, async (req, res) => {
    const list = await list_1.List.findById(req.params.id);
    if (!list) {
        throw new common_1.NotFoundError();
    }
    if (list.creatorId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    await list.remove();
    res.send(list);
});

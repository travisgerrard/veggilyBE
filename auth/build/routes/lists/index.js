"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexListRouter = void 0;
const express_1 = __importDefault(require("express"));
const list_1 = require("../../models/list");
const router = express_1.default.Router();
exports.indexListRouter = router;
router.get('/api/lists', async (req, res) => {
    if (!req.currentUser) {
        return res.send([
            {
                id: '12345',
                title: 'Need to sign in to see grocery list',
            },
        ]);
    }
    const lists = await list_1.List.find({ creatorId: req.currentUser.id });
    res.send(lists);
});

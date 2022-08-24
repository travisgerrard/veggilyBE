"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalMealRouter = void 0;
const common_1 = require("@tgticketing/common");
const express_1 = __importDefault(require("express"));
const common_2 = require("@nestjs/common");
const scraper_1 = require("./scraper");
const router = express_1.default.Router();
exports.generalMealRouter = router;
router.post('/api/general', 
// requireAuth,
async (req, res, next) => {
    const { url } = req.body;
    console.log(url);
    const HTMLData = await (0, scraper_1.fetchPage)(url);
    if (HTMLData === undefined) {
        throw common_1.NotFoundError;
    }
    console.log(HTMLData);
    let logger = new common_2.Logger('scrapeRecipe');
    let returnedRecipe = (0, scraper_1.scrapeRecipe)(HTMLData, (...args) => logger.warn(...args));
    console.log(returnedRecipe);
    return res.status(201).send(url);
});

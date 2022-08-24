"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importMealRouter = void 0;
const common_1 = require("@tgticketing/common");
const express_1 = __importDefault(require("express"));
// const cloudinary = require('cloudinary').v2;
const cloudinary_1 = require("cloudinary");
const multer = require('multer');
const upload = multer({
    dest: 'temp/',
    limits: { fileSize: 10 * 1024 * 1024 },
}).single('image');
const fs = require('fs');
// const recipeScraper = require('recipe-scraper');
const scraper_1 = require("./scraper");
const common_2 = require("@nestjs/common");
const meal_1 = require("../../models/meal");
const ingredient_1 = require("../../models/ingredient");
const instruction_1 = require("../../models/instruction");
const router = express_1.default.Router();
exports.importMealRouter = router;
const formatCloudinaryUrl = (url, size, thumb) => {
    const splitUrl = url.split('upload/');
    splitUrl[0] += `upload/w_${size.width},h_${size.height}${thumb && ',c_thumb'}/`;
    const formattedUrl = splitUrl[0] + splitUrl[1];
    return formattedUrl;
};
router.post('/api/import', common_1.requireAuth, upload, async (req, res, next) => {
    const { url } = req.body;
    console.log(url);
    const HTMLData = await (0, scraper_1.fetchPage)(url);
    if (HTMLData === undefined) {
        throw common_1.NotFoundError;
    }
    let logger = new common_2.Logger('scrapeRecipe');
    let returnedRecipe = (0, scraper_1.scrapeRecipe)(HTMLData, (...args) => logger.warn(...args));
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    try {
        const response = await cloudinary_1.v2.uploader.upload(returnedRecipe.imageUrl);
        console.log(response);
        const thumbnailUrl = formatCloudinaryUrl(response.secure_url, {
            width: 400,
            height: 400,
        }, true);
        console.log(thumbnailUrl);
        const meal = meal_1.Meal.build({
            title: returnedRecipe.name,
            whereToFind: url,
            imageUrl: response.secure_url,
            thumbnail: thumbnailUrl,
            mealType: common_1.MealType.Dinner,
            creatorId: req.currentUser.id,
        });
        await meal.save();
        returnedRecipe.ingredients.forEach(async (ingredientString, index) => {
            let orderNumber = index;
            const ingredient = ingredient_1.Ingredient.build({
                title: ingredientString,
                ingredientType: common_1.IngredientType.None,
                imageUrl: '',
                creatorId: req.currentUser.id,
                orderNumber,
                meal,
            });
            await ingredient.save();
        });
        returnedRecipe.instructions.forEach(async (instructionString, index) => {
            let orderNumber = index;
            const instruction = instruction_1.Instruction.build({
                text: instructionString.text,
                bold: instructionString.bold,
                creatorId: req.currentUser.id,
                meal,
                orderNumber,
            });
            await instruction.save();
        });
        return res.status(201).send(meal);
    }
    catch {
        return next({
            message: 'Error uploading image, please try again later.',
        });
    }
});

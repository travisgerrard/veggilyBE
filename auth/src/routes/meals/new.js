"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMealRouter = void 0;
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
const express_validator_1 = require("express-validator");
const meal_1 = require("../../models/meal");
const router = express_1.default.Router();
exports.createMealRouter = router;
const formatCloudinaryUrl = (url, size, thumb) => {
    const splitUrl = url.split('upload/');
    splitUrl[0] += `upload/w_${size.width},h_${size.height}${thumb && ',c_thumb'}/`;
    const formattedUrl = splitUrl[0] + splitUrl[1];
    return formattedUrl;
};
router.post('/api/meals', common_1.requireAuth, upload, [(0, express_validator_1.check)('title').notEmpty().withMessage('Title is required')], 
// [body('title').not().isEmpty().withMessage('Title is required')],
common_1.validateRequest, async (req, res, next) => {
    const { title, whereToFind, imageUrl, thumbnail, mealType } = req.body;
    if (!req.file) {
        const meal = meal_1.Meal.build({
            title,
            whereToFind,
            imageUrl,
            thumbnail,
            mealType,
            creatorId: req.currentUser.id,
        });
        await meal.save();
        return res.status(201).send(meal);
    }
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    try {
        const response = await cloudinary_1.v2.uploader.upload(req.file.path);
        console.log(response);
        const thumbnailUrl = formatCloudinaryUrl(response.secure_url, {
            width: 400,
            height: 400,
        }, true);
        console.log(thumbnailUrl);
        fs.unlinkSync(req.file.path);
        const meal = meal_1.Meal.build({
            title,
            whereToFind,
            imageUrl: response.secure_url,
            thumbnail: thumbnailUrl,
            mealType,
            creatorId: req.currentUser.id,
        });
        await meal.save();
        return res.status(201).send(meal);
    }
    catch {
        return next({
            message: 'Error uploading image, please try again later.',
        });
    }
});

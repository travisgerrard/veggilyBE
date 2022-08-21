import {
  requireAuth,
  validateRequest,
  MealType,
  IngredientType,
  NotFoundError,
} from '@tgticketing/common';
import express, { Request, Response, NextFunction } from 'express';
// const cloudinary = require('cloudinary').v2;
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
const multer = require('multer');
const upload = multer({
  dest: 'temp/',
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('image');
const fs = require('fs');
// const recipeScraper = require('recipe-scraper');
import { scrapeRecipe, fetchPage } from './scraper';
import { Logger } from '@nestjs/common';

import { check } from 'express-validator';
import { Meal } from '../../models/meal';
import { Ingredient } from '../../models/ingredient';
import { Instruction } from '../../models/instruction';

const router = express.Router();

const formatCloudinaryUrl = (
  url: string,
  size: { width: number; height: number },
  thumb: Boolean
) => {
  const splitUrl = url.split('upload/');
  splitUrl[0] += `upload/w_${size.width},h_${size.height}${
    thumb && ',c_thumb'
  }/`;
  const formattedUrl = splitUrl[0] + splitUrl[1];
  return formattedUrl;
};

interface MulterRequest extends Request {
  file: any;
}

interface Recipe {
  name: string;
  ingredients: Array<string>;
  image: string;
}

router.post(
  '/api/import',
  requireAuth,
  upload,

  async (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;

    console.log(url);

    const HTMLData = await fetchPage(url);
    if (HTMLData === undefined) {
      throw NotFoundError;
    }

    let logger = new Logger('scrapeRecipe');

    let returnedRecipe = scrapeRecipe(HTMLData, (...args) =>
      logger.warn(...args)
    );

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
      const response = await cloudinary.uploader.upload(
        returnedRecipe.imageUrl!
      );
      console.log(response);
      const thumbnailUrl = formatCloudinaryUrl(
        response.secure_url,
        {
          width: 400,
          height: 400,
        },
        true
      );
      console.log(thumbnailUrl);

      const meal = Meal.build({
        title: returnedRecipe.name,
        whereToFind: url,
        imageUrl: response.secure_url,
        thumbnail: thumbnailUrl,
        mealType: MealType.Dinner,
        creatorId: req.currentUser!.id,
      });
      await meal.save();

      returnedRecipe.ingredients.forEach(async (ingredientString, index) => {
        let orderNumber = index;
        const ingredient = Ingredient.build({
          title: ingredientString,
          ingredientType: IngredientType.None,
          imageUrl: '',
          creatorId: req.currentUser!.id,
          orderNumber,
          meal,
        });
        await ingredient.save();
      });

      returnedRecipe.instructions.forEach(async (instructionString, index) => {
        let orderNumber = index;

        const instruction = Instruction.build({
          text: instructionString.text,
          bold: instructionString.bold,
          creatorId: req.currentUser!.id,
          meal,
          orderNumber,
        });
        await instruction.save();
      });

      return res.status(201).send(meal);
    } catch {
      return next({
        message: 'Error uploading image, please try again later.',
      });
    }
  }
);

export { router as importMealRouter };

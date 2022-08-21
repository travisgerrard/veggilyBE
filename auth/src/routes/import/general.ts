import {
  requireAuth,
  validateRequest,
  MealType,
  IngredientType,
  NotFoundError,
} from '@tgticketing/common';
import express, { Request, Response, NextFunction } from 'express';

import { Logger } from '@nestjs/common';
import { scrapeRecipe, fetchPage } from './scraper';

const router = express.Router();

router.post(
  '/api/general',
  // requireAuth,

  async (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;
    console.log(url);

    const HTMLData = await fetchPage(url);
    if (HTMLData === undefined) {
      throw NotFoundError;
    }

    console.log(HTMLData);

    let logger = new Logger('scrapeRecipe');

    let returnedRecipe = scrapeRecipe(HTMLData, (...args) =>
      logger.warn(...args)
    );

    console.log(returnedRecipe);

    return res.status(201).send(url);
  }
);

export { router as generalMealRouter };

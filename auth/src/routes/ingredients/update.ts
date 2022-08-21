import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from '@tgticketing/common';
import { Ingredient } from '../../models/ingredient';
// import { IngredientUpdatedPublisher } from '../events/publishers/ingredient-updated-publisher';
// import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/ingredients/:id',
  requireAuth,
  [body('title').not().isEmpty().withMessage('Title is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, ingredientType, imageUrl, mealId } = req.body;

    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      throw new NotFoundError();
    }

    if (ingredient.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ingredient.set({
      title,
      imageUrl,
      ingredientType,
    });
    await ingredient.save();

    // new IngredientUpdatedPublisher(natsWrapper.client).publish({
    //   id: ingredient.id,
    //   version: ingredient.version,
    //   title: ingredient.title,
    //   meal: ingredient.meal?.id,
    //   ingredientType: ingredient.ingredientType,
    // });

    res.send(ingredient);
  }
);

export { router as updateIngredientRouter };

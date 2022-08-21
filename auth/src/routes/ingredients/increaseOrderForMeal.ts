import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from '@tgticketing/common';
import { Ingredient } from '../../models/ingredient';

const router = express.Router();

router.put(
  '/api/ingredients/increase/:id',
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const ingredient = await Ingredient.findById(req.params.id).populate(
      'meal'
    );

    if (!ingredient || !ingredient.meal.id) {
      throw new NotFoundError();
    }

    if (ingredient.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const maxOrderNumber = (await Ingredient.find({ meal: ingredient.meal.id }))
      .length;
    if (ingredient.orderNumber === maxOrderNumber - 1) {
      throw new BadRequestError('Already the last item in the list');
    }

    const ingredients = await Ingredient.find({
      meal: ingredient.meal.id,
    }).sort('orderNumber');

    const ingredientToSwitchWith = ingredients[ingredient.orderNumber + 1];

    ingredientToSwitchWith.set({
      orderNumber: ingredient.orderNumber,
    });
    await ingredientToSwitchWith.save();
    ingredient.set({
      orderNumber: ingredient.orderNumber + 1,
    });
    await ingredient.save();

    res.send(ingredient);
  }
);

export { router as increaseIngredientOrderRouter };

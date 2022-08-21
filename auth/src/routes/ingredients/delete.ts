import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@tgticketing/common';
import express, { Request, Response } from 'express';
import { Ingredient } from '../../models/ingredient';

const router = express.Router();

router.delete(
  '/api/ingredients/:ingredientId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { ingredientId } = req.params;
    const ingredient = await Ingredient.findById(ingredientId).populate('meal');

    if (!ingredient) {
      throw new NotFoundError();
    }

    if (ingredient.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Update ordernumbers when item is deleated
    if (ingredient.meal) {
      const ingredients = await Ingredient.find({ meal: ingredient.meal.id });

      ingredients.forEach(async (ingredientItem) => {
        if (ingredientItem.orderNumber > ingredient.orderNumber) {
          ingredientItem.set({
            orderNumber: ingredientItem.orderNumber - 1,
          });

          await ingredientItem.save();
        }
      });
    }

    await ingredient.remove();

    res.status(204).send(ingredient);
  }
);

export { router as deleteIngredientRouter };

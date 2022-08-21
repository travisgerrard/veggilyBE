import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError } from '@tgticketing/common';
import { Ingredient } from '../../models/ingredient';

const router = express.Router();

router.get('/api/ingredients/meal/:id', async (req: Request, res: Response) => {
  const ingredients = await Ingredient.find({ meal: req.params.id }).sort(
    'orderNumber'
  );

  if (!ingredients) {
    throw new NotFoundError();
  }

  res.send(ingredients);
});

export { router as showIngredientsForMealRouter };

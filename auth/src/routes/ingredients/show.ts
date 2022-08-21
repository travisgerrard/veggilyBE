import express, { Request, Response } from 'express';
import { NotFoundError } from '@tgticketing/common';
import { Ingredient } from '../../models/ingredient';

const router = express.Router();

router.get('/api/ingredients/:id', async (req: Request, res: Response) => {
  const ingredient = await Ingredient.findById(req.params.id);

  if (!ingredient) {
    throw new NotFoundError();
  }

  res.send(ingredient);
});

export { router as showIngredientRouter };

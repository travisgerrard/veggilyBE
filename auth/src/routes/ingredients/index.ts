import express, { Request, Response } from 'express';
import { Ingredient } from '../../models/ingredient';

const router = express.Router();

router.get('/api/ingredients', async (req: Request, res: Response) => {
  const ingredients = await Ingredient.find();

  res.send(ingredients);
});

export { router as indexIngredientRouter };

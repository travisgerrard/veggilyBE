import express, { Request, Response } from 'express';
import { Meal } from '../../models/meal';

const router = express.Router();

router.get('/api/meals', async (req: Request, res: Response) => {
  const meals = await Meal.find().sort({ createdAt: -1 });

  res.send(meals);
});

export { router as indexMealRouter };

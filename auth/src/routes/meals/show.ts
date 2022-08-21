import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError } from '@tgticketing/common';
import { Meal } from '../../models/meal';

const router = express.Router();

router.get('/api/meals/:id', async (req: Request, res: Response) => {
  const meal = await Meal.findById(req.params.id);

  if (!meal) {
    throw new NotFoundError();
  }

  res.send(meal);
});

export { router as showMealRouter };

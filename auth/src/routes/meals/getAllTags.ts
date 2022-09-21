import express, { Request, Response } from 'express';
import { Meal } from '../../models/meal';

const router = express.Router();

router.get('/api/tags', async (req: Request, res: Response) => {
  const meals = await Meal.find();
  let tags: Array<string>;
  tags = [];

  meals.forEach((meal) => {
    if (meal.tags) {
      // merge arrays
      tags = tags.concat(meal.tags);

      // erase duplicates
      tags = [...new Set([...meal.tags, ...tags])];
    }
  });

  res.send(tags);
});

export { router as getAllTagsRouter };

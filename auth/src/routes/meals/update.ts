import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from '@tgticketing/common';
import { Meal } from '../../models/meal';
// import { MealUpdatedPublisher } from '../events/publishers/meal-updated-publisher';
// import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/meals/:id',
  requireAuth,
  [body('title').not().isEmpty().withMessage('Title is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, whereToFind, mealType } = req.body;

    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      throw new NotFoundError();
    }

    if (meal.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    meal.set({
      title: title || meal.title,
      whereToFind: whereToFind || meal.whereToFind,
      mealType,
    });
    await meal.save();

    // new MealUpdatedPublisher(natsWrapper.client).publish({
    //   id: meal.id,
    //   version: meal.version,
    //   title: meal.title,
    // });

    res.send(meal);
  }
);

export { router as updateMealRouter };

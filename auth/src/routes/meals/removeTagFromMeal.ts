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
  '/api/meals/:id/removeTag',
  requireAuth,
  [body('tag').not().isEmpty().withMessage('Tag is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { tag } = req.body;

    console.log(tag);

    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      throw new NotFoundError();
    }

    if (meal.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    meal.tags.splice(meal.tags.indexOf(tag), 1);
    await meal.save();

    // new MealUpdatedPublisher(natsWrapper.client).publish({
    //   id: meal.id,
    //   version: meal.version,
    //   title: meal.title,
    // });

    res.send(meal.tags);
  }
);

export { router as removeTagFromMealRouter };

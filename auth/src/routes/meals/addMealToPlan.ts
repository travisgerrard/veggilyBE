import express, { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from '@tgticketing/common';
// import { natsWrapper } from '../nats-wrapper';
import { Meal } from '../../models/meal';
import { Plan } from '../../models/plan';

const router = express.Router();

router.post(
  '/api/meals/addMealToPlan/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      throw new NotFoundError();
    }

    const plan = Plan.build({
      meal: meal,
      creatorId: req.currentUser!.id,
      datePlanToMake: new Date(),
      isCompleted: false,
    });
    await plan.save();

    res.send(meal);
  }
);

export { router as addMealToPlanRouter };

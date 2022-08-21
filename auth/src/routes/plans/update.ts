import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from '@tgticketing/common';
import { Plan } from '../../models/plan';

const router = express.Router();

router.put(
  '/api/plans/update/:id',
  requireAuth,
  [body('datePlanToMake').not().isEmpty().withMessage('date is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { datePlanToMake } = req.body;

    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      throw new NotFoundError();
    }

    if (plan.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    plan.set({
      datePlanToMake,
    });
    await plan.save();

    res.send(plan);
  }
);

export { router as updatePlanRouter };

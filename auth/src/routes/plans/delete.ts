import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@tgticketing/common';
import express, { Request, Response } from 'express';
import { Plan } from '../../models/plan';

const router = express.Router();

router.delete(
  '/api/plans/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      throw new NotFoundError();
    }

    if (plan.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await plan.remove();

    res.send(plan);
  }
);

export { router as deletePlanRouter };

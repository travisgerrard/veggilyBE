import express, { Request, Response } from 'express';
import { Plan } from '../../models/plan';

const router = express.Router();

router.get('/api/plans', async (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.send([
      {
        id: '12345',
        title: 'Need to sign in to see your meal plan',
      },
    ]);
  }

  const plans = await Plan.find({ creatorId: req.currentUser.id })
    .populate('meal')
    .populate('ingredients');

  res.send(plans);
});

export { router as indexPlanRouter };

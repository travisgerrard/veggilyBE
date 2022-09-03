import { requireAuth } from '@tgticketing/common';
import express, { Request, Response } from 'express';
import { Comment } from '../../models/comment';

const router = express.Router();

router.get('/api/comments/meal/:id', async (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.send([
      {
        id: '12345',
        comment: 'Need to sign in to see comment',
        date: new Date(),
      },
    ]);
  }

  const comments = await Comment.find({
    meal: req.params.id,
    creatorId: req.currentUser!.id,
  });

  res.send(comments);
});

router.get('/api/comments/', async (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.send([
      {
        id: '12345',
        comment: 'Need to sign in to see comments',
        date: new Date(),
      },
    ]);
  }

  const comments = await Comment.find({
    creatorId: req.currentUser!.id,
  }).sort({ dateMade: -1 });

  res.send(comments);
});

export { router as indexCommentsRouter };

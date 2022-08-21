import express, { Request, Response } from 'express';
import { List } from '../../models/list';

const router = express.Router();

router.get('/api/lists', async (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.send([
      {
        id: '12345',
        title: 'Need to sign in to see grocery list',
      },
    ]);
  }

  const lists = await List.find({ creatorId: req.currentUser.id });

  res.send(lists);
});

export { router as indexListRouter };

import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@tgticketing/common';
import express, { Request, Response } from 'express';
import { List } from '../../models/list';

const router = express.Router();

router.delete(
  '/api/lists/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const list = await List.findById(req.params.id);

    if (!list) {
      throw new NotFoundError();
    }

    if (list.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await list.remove();

    res.send(list);
  }
);

export { router as deleteListRouter };

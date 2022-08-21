import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@tgticketing/common';
import express, { Request, Response } from 'express';
import { Comment } from '../../models/comment';

const router = express.Router();

router.delete(
  '/api/comments/:commentId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new NotFoundError();
    }

    if (comment.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    await comment.remove();

    res.status(204).send(comment);
  }
);

export { router as deleteCommentRouter };

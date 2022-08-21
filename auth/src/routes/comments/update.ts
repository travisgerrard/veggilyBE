import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from '@tgticketing/common';
import { Comment } from '../../models/comment';

const router = express.Router();

router.put(
  '/api/comments/:id',
  requireAuth,
  [
    body('comment').not().isEmpty().withMessage('Comment is required'),
    body('dateMade').not().isEmpty().withMessage('date is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { comment: newComment, dateMade } = req.body;

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      throw new NotFoundError();
    }

    if (comment.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    comment.set({
      comment: newComment,
      dateMade,
    });
    await comment.save();

    res.send(comment);
  }
);

export { router as updateCommentRouter };

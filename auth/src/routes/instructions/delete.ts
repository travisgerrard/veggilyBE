import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@tgticketing/common';
import express, { Request, Response } from 'express';
import { Instruction } from '../../models/instruction';

const router = express.Router();

router.delete(
  '/api/instructions/:instructionId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { instructionId } = req.params;
    const instruction = await Instruction.findById(instructionId).populate(
      'meal'
    );

    if (!instruction) {
      throw new NotFoundError();
    }

    if (instruction.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Update ordernumbers when item is deleated
    if (instruction.meal) {
      const instructions = await Instruction.find({
        meal: instruction.meal.id,
      });

      instructions.forEach(async (instructionItem) => {
        if (instructionItem.orderNumber > instruction.orderNumber) {
          instructionItem.set({
            orderNumber: instructionItem.orderNumber - 1,
          });

          await instructionItem.save();
        }
      });
    }

    await instruction.remove();

    res.status(204).send(instruction);
  }
);

export { router as deleteInstructionRouter };

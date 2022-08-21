import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from '@tgticketing/common';
import { Instruction } from '../../models/instruction';

const router = express.Router();

router.put(
  '/api/instructions/increase/:id',
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const instruction = await Instruction.findById(req.params.id).populate(
      'meal'
    );

    if (!instruction || !instruction.meal.id) {
      throw new NotFoundError();
    }

    if (instruction.creatorId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const maxOrderNumber = (
      await Instruction.find({ meal: instruction.meal.id })
    ).length;
    if (instruction.orderNumber === maxOrderNumber - 1) {
      throw new BadRequestError('Already the last item in the list');
    }

    const instructions = await Instruction.find({
      meal: instruction.meal.id,
    }).sort('orderNumber');

    const instructionToSwitchWith = instructions[instruction.orderNumber + 1];

    instructionToSwitchWith.set({
      orderNumber: instruction.orderNumber,
    });
    await instructionToSwitchWith.save();
    instruction.set({
      orderNumber: instruction.orderNumber + 1,
    });
    await instruction.save();

    res.send(instruction);
  }
);

export { router as increaseInstructionOrderRouter };

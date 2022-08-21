import express, { Request, Response } from 'express';
import { Instruction } from '../../models/instruction';

const router = express.Router();

router.get('/api/instructions', async (req: Request, res: Response) => {
  const instructions = await Instruction.find();

  res.send(instructions);
});

export { router as indexInstructionRouter };

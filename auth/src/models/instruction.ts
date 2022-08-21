import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { MealDoc } from './meal';

interface InstructionAttrs {
  text: string;
  bold: boolean;
  creatorId: string;
  meal: MealDoc;
  orderNumber: number;
}

interface InstructionDoc extends mongoose.Document {
  text: string;
  bold: boolean;
  creatorId: string;
  meal: MealDoc;
  orderNumber: number;
  version: number;
}

interface InstructionModel extends mongoose.Model<InstructionDoc> {
  build(attrs: InstructionAttrs): InstructionDoc;
}

const instructionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      require: true,
    },
    bold: {
      type: Boolean,
      required: true,
      default: false,
    },
    creatorId: {
      type: String,
      require: true,
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
      required: false,
    },
    orderNumber: {
      type: Number,
      require: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

instructionSchema.set('versionKey', 'version');
instructionSchema.set('timestamps', true);
instructionSchema.plugin(updateIfCurrentPlugin);

instructionSchema.statics.build = (attrs: InstructionAttrs) => {
  return new Instruction(attrs);
};

const Instruction = mongoose.model<InstructionDoc, InstructionModel>(
  'Instruction',
  instructionSchema
);

export { Instruction };

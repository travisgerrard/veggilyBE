import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { List, ListDoc } from './list';
import { MealDoc } from './meal';

interface PlanAttrs {
  meal: MealDoc;
  creatorId: string;
  datePlanToMake: Date;
  isCompleted: boolean;
  ingredients?: Array<ListDoc>;
}

export interface PlanDoc extends mongoose.Document {
  meal: MealDoc;
  datePlanToMake: Date;
  version: number;
  isCompleted: boolean;
  creatorId: string;
  ingredients?: Array<ListDoc>;
}

interface PlanModel extends mongoose.Model<PlanDoc> {
  build(attrs: PlanAttrs): PlanDoc;
}

const planSchema = new mongoose.Schema(
  {
    creatorId: {
      type: String,
      require: true,
    },
    isCompleted: {
      type: Boolean,
      require: true,
      default: false,
    },
    datePlanToMake: {
      type: mongoose.Schema.Types.Date,
      required: true,
      default: new Date(),
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      virtuals: true,
    },
  }
);

planSchema.statics.build = (attrs: PlanAttrs) => {
  return new Plan(attrs);
};

planSchema.virtual('ingredients', {
  ref: 'List',
  localField: 'meal',
  foreignField: 'meal',
});

const Plan = mongoose.model<PlanDoc, PlanModel>('Plan', planSchema);

export { Plan };

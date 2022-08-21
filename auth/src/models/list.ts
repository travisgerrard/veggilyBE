import mongoose from 'mongoose';
import { IngredientType } from '@tgticketing/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { MealDoc } from './meal';

interface ListAttrs {
  title: string;
  ingredientType: IngredientType;
  meal: MealDoc;
  creatorId: string;
  isCompleted: boolean;
}

export interface ListDoc extends mongoose.Document {
  title: string;
  ingredientType: IngredientType;
  meal: MealDoc;
  version: number;
  isCompleted: boolean;
  creatorId: string;
}

interface ListModel extends mongoose.Model<ListDoc> {
  build(attrs: ListAttrs): ListDoc;
}

const listSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    ingredientType: {
      type: String,
      enum: Object.values(IngredientType),
    },
    creatorId: {
      type: String,
      require: true,
    },
    isCompleted: {
      type: Boolean,
      require: true,
      default: false,
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
      required: false,
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

listSchema.statics.build = (attrs: ListAttrs) => {
  return new List(attrs);
};

const List = mongoose.model<ListDoc, ListModel>('List', listSchema);

export { List };

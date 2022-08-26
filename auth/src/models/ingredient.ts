import mongoose from 'mongoose';
import { IngredientType } from '@tgticketing/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { MealDoc } from './meal';

interface IngredientAttrs {
  title: string;
  ingredientType: IngredientType;
  imageUrl: string;
  creatorId: string;
  meal: MealDoc;
  orderNumber: number;
}

interface IngredientDoc extends mongoose.Document {
  title: string;
  ingredientType: IngredientType;
  imageUrl: string;
  creatorId: string;
  meal: MealDoc;
  orderNumber: number;
  version: number;
}

interface IngredientModel extends mongoose.Model<IngredientDoc> {
  build(attrs: IngredientAttrs): IngredientDoc;
}

const ingredientSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    imageUrl: {
      type: String,
      require: false,
    },

    creatorId: {
      type: String,
      require: true,
    },
    ingredientType: {
      type: String,
      enum: Object.values(IngredientType),
      default: IngredientType.None,
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

ingredientSchema.set('versionKey', 'version');
ingredientSchema.set('timestamps', true);
ingredientSchema.plugin(updateIfCurrentPlugin);

ingredientSchema.statics.build = (attrs: IngredientAttrs) => {
  return new Ingredient(attrs);
};

const Ingredient = mongoose.model<IngredientDoc, IngredientModel>(
  'Ingredient',
  ingredientSchema
);

export { Ingredient };

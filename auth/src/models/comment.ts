import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { MealDoc } from './meal';

interface CommentAttrs {
  comment: string;
  imageUrl: string;
  creatorId: string;
  dateMade: Date;
  meal: MealDoc;
}

interface CommentDoc extends mongoose.Document {
  comment: string;
  imageUrl: string;
  creatorId: string;
  dateMade: Date;
  meal: MealDoc;
  version: number;
}

interface CommentModel extends mongoose.Model<CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc;
}

const commentSchema = new mongoose.Schema(
  {
    comment: {
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
    dateMade: {
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
    },
  }
);

commentSchema.set('versionKey', 'version');
commentSchema.set('timestamps', true);
commentSchema.plugin(updateIfCurrentPlugin);

commentSchema.statics.build = (attrs: CommentAttrs) => {
  return new Comment(attrs);
};

const Comment = mongoose.model<CommentDoc, CommentModel>(
  'Comment',
  commentSchema
);

export { Comment };

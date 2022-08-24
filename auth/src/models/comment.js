"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const commentSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.Date,
        required: true,
        default: new Date(),
    },
    meal: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Meal',
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
commentSchema.set('versionKey', 'version');
commentSchema.set('timestamps', true);
commentSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
commentSchema.statics.build = (attrs) => {
    return new Comment(attrs);
};
const Comment = mongoose_1.default.model('Comment', commentSchema);
exports.Comment = Comment;

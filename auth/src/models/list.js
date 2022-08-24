"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("@tgticketing/common");
const listSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        require: true,
    },
    ingredientType: {
        type: String,
        enum: Object.values(common_1.IngredientType),
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Meal',
        required: false,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
listSchema.statics.build = (attrs) => {
    return new List(attrs);
};
const List = mongoose_1.default.model('List', listSchema);
exports.List = List;

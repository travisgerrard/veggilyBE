"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plan = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const planSchema = new mongoose_1.default.Schema({
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
        virtuals: true,
    },
});
planSchema.statics.build = (attrs) => {
    return new Plan(attrs);
};
planSchema.virtual('ingredients', {
    ref: 'List',
    localField: 'meal',
    foreignField: 'meal',
});
const Plan = mongoose_1.default.model('Plan', planSchema);
exports.Plan = Plan;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instruction = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const instructionSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Meal',
        required: false,
    },
    orderNumber: {
        type: Number,
        require: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
instructionSchema.set('versionKey', 'version');
instructionSchema.set('timestamps', true);
instructionSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
instructionSchema.statics.build = (attrs) => {
    return new Instruction(attrs);
};
const Instruction = mongoose_1.default.model('Instruction', instructionSchema);
exports.Instruction = Instruction;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ingredient = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("@tgticketing/common");
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const ingredientSchema = new mongoose_1.default.Schema({
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
        enum: Object.values(common_1.IngredientType),
        default: common_1.IngredientType.None,
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
ingredientSchema.set('versionKey', 'version');
ingredientSchema.set('timestamps', true);
ingredientSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
ingredientSchema.statics.build = (attrs) => {
    return new Ingredient(attrs);
};
const Ingredient = mongoose_1.default.model('Ingredient', ingredientSchema);
exports.Ingredient = Ingredient;

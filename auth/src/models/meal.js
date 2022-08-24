"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meal = exports.MealType = void 0;
const common_1 = require("@tgticketing/common");
Object.defineProperty(exports, "MealType", { enumerable: true, get: function () { return common_1.MealType; } });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const mealSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        require: true,
    },
    whereToFind: {
        type: String,
        require: false,
    },
    imageUrl: {
        type: String,
        require: false,
    },
    thumbnail: {
        type: String,
        require: false,
    },
    creatorId: {
        type: String,
        require: true,
    },
    mealType: {
        type: String,
        required: false,
        enum: Object.values(common_1.MealType),
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
mealSchema.set('versionKey', 'version');
mealSchema.set('timestamps', true);
mealSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
mealSchema.statics.build = (attrs) => {
    return new Meal(attrs);
};
const Meal = mongoose_1.default.model('Meal', mealSchema);
exports.Meal = Meal;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const start = async () => {
    console.log('Starting');
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI, {});
        console.log('Connected to MongoDb');
    }
    catch (err) {
        console.error(err);
    }
    app_1.app.listen(3080, () => {
        console.log('Listening on port 3080!!!');
    });
};
start();

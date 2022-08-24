"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
exports.cloudinary = {
    charges: {
        create: jest.fn().mockReturnValue({ secure_url: 'a secure URL' }),
    },
};

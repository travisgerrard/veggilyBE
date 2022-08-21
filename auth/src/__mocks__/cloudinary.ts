export const cloudinary = {
  charges: {
    create: jest.fn().mockReturnValue({ secure_url: 'a secure URL' }),
  },
};

import mongoose from 'mongoose';

export const attachmentSchema = new mongoose.Schema({
  mimetype: String,
  name: String,
  data: Buffer
});

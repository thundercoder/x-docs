import mongoose from 'mongoose';

export const attachmentSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  mimetype: String,
  name: String,
  data: Buffer
});

// export const Attachment: AttachmentType = mongoose.model<Attachment>('Attachment', attachmentSchema);
const Attachment = mongoose.model('Attachment', attachmentSchema);
export default Attachment;
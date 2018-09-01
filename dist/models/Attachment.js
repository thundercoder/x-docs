"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.attachmentSchema = new mongoose_1.default.Schema({
    eventId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Event' },
    mimetype: String,
    name: String,
    data: Buffer
});
// export const Attachment: AttachmentType = mongoose.model<Attachment>('Attachment', attachmentSchema);
const Attachment = mongoose_1.default.model('Attachment', exports.attachmentSchema);
exports.default = Attachment;
//# sourceMappingURL=Attachment.js.map
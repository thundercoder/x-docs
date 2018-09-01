"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const specialistSchema = new mongoose_1.default.Schema({
    code: { type: String, unique: true },
    description: String,
    questions: []
}, { timestamps: true });
// export const Specialist: UserType = mongoose.model<UserType>('User', userSchema);
const Specialist = mongoose_1.default.model('Specialist', specialistSchema);
exports.default = Specialist;
//# sourceMappingURL=Specialist.js.map
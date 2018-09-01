"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./User"));
exports.familySchema = new mongoose_1.default.Schema({
    firstName: String,
    lastName: String,
    birthDay: Date,
    relationship: String,
    patientId: {
        type: String,
        index: true,
        validate: {
            isAsync: true,
            validator: (v, cb) => {
                User_1.default.findOne({ 'patients._id': v }, { 'patients.$': 1 }, (err, patient) => {
                    if (!patient)
                        cb(false);
                    else
                        cb(true);
                });
            },
            message: '{VALUE} is not a valid patient.'
        }
    },
    userId: { type: String, index: true }
}, { timestamps: true });
// export const User: UserType = mongoose.model<UserType>('Family', familySchema);
const Family = mongoose_1.default.model('Family', exports.familySchema);
exports.default = Family;
//# sourceMappingURL=Family.js.map
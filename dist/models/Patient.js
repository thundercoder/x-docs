"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
exports.patientSchema = new mongoose_1.default.Schema({
    firstName: String,
    lastName: String,
    phone: String,
    mobile: String,
    bodyPerson: {
        height: Number,
        weight: Number,
        color: String
    },
    date: { type: Date, default: Date.now },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
exports.patientSchema.plugin(mongoose_paginate_1.default);
// export const Patient: PatientType = mongoose.model<Patient>('Patient', patientSchema);
const Patient = mongoose_1.default.model('Patient', exports.patientSchema);
exports.default = Patient;
//# sourceMappingURL=Patient.js.map
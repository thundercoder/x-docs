"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const Patient_1 = __importDefault(require("./Patient"));
exports.eventSchema = new mongoose_1.default.Schema({
    date: { type: Date, default: Date.now },
    cause: String,
    patientFullName: String,
    resolution: String,
    backgroundQuestions: [],
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    patientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Patient',
        index: true,
        validate: {
            isAsync: true,
            validator: (v, cb) => {
                Patient_1.default.findOne({ '_id': v }, (err, patient) => {
                    if (!patient)
                        cb(false);
                    else
                        cb(true);
                });
            },
            message: '{VALUE} is not a valid patient.'
        }
    }
}, { timestamps: true });
exports.eventSchema.plugin(mongoose_paginate_1.default);
/**
 * Save patient full name middleware.
 */
exports.eventSchema.pre('save', function save(next) {
    const event = this;
    if (!event.isModified('patientId')) {
        return next();
    }
    Patient_1.default.findOne({ '_id': event.patientId, 'userId': event.userId }, (err, patient) => {
        if (err)
            return next(err);
        if (!patient)
            return next('Patient not found.');
        event.patientFullName = patient.firstName + ' ' + patient.lastName;
        next();
    });
});
// export const Event: EventType = mongoose.model<UserType>('Event', eventSchema);
const Event = mongoose_1.default.model('Event', exports.eventSchema);
exports.default = Event;
//# sourceMappingURL=Event.js.map
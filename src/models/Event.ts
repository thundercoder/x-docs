import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { default as User, UserModel } from './User';
import { QuestionModel } from './Specialist';
import Patient, { PatientModel } from './Patient';

export const eventSchema = new mongoose.Schema({
  date: {type: Date, default: Date.now},
  cause: String,
  patientFullName: String,
  resolution: String,
  backgroundQuestions: [],
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    index: true,
    validate: {
      isAsync: true,
      validator: (v: any, cb: (result: any, msg?: any) => {}) => {
        Patient.findOne({'_id': v}, (err, patient: PatientModel) => {
          if (!patient)
            cb(false);
          else
            cb(true);
        });
      },
      message: '{VALUE} is not a valid patient.'
    }
  }
}, {timestamps: true});

eventSchema.plugin(mongoosePaginate);

/**
 * Save patient full name middleware.
 */
eventSchema.pre('save', function save(next) {
  const event = this;

  if (!event.isModified('patientId')) {
    return next();
  }

  Patient.findOne({'_id': event.patientId, 'userId': event.userId}, (err: any, patient: PatientModel) => {
    if (err) return next(err);

    if (!patient)
      return next('Patient not found.');

    event.patientFullName = patient.firstName + ' ' + patient.lastName;

    next();
  });
});

export type EventModel = mongoose.Document & {
  cause: string,
  resolution: string,
  patientFullName: string,
  backgroundQuestions: QuestionModel[],
  patientId: string,
  userId: string
};

// export const Event: EventType = mongoose.model<UserType>('Event', eventSchema);
const Event = mongoose.model('Event', eventSchema);
export default Event;
import mongoose from 'mongoose';
import { default as User, UserModel } from './User';
import { QuestionModel } from './Specialist';

export const eventSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  cause: String,
  resolution: String,
  backgrundQuestions: [],
  attachments: [String],
  patientId: {
    type: String,
    index: true,
    validate: {
      isAsync: true,
      validator: (v: any, cb: (result: any, msg?: any) => {}) => {
        User.findOne({'patients._id': v}, {'patients.$': 1}, (err, patient: UserModel) => {
          if (!patient)
            cb(false);
          else
            cb(true);
        });
      },
      message: '{VALUE} is not a valid patient.'
    }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export type EventModel = mongoose.Document & {
  cause: string,
  resolution: string,
  backgroundQuestions: QuestionModel[],
  attachments: string[],
  patientId: string,
  userId: string
};

// export const Event: EventType = mongoose.model<UserType>('Event', eventSchema);
const Event = mongoose.model('Event', eventSchema);
export default Event;
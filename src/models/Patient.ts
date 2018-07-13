import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

export const patientSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  mobile: String,
  bodyPerson: {
    height: Number,
    weight: Number,
    color: String
  },
  date: {type: Date, default: Date.now},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, { timestamps: true });

patientSchema.plugin(mongoosePaginate);

export type PatientModel = mongoose.Document & {
  firstName: string,
  lastName: string,
  phone: string,
  mobile: string,
  bodyPerson: {
    height: number,
    weight: number,
    color: string
  },
  date: Date,
  userId: string
};

// export const Patient: PatientType = mongoose.model<Patient>('Patient', patientSchema);
const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
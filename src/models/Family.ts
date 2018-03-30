import mongoose from "mongoose";
import { default as User, UserModel } from "./User";

export const familySchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    birthDay: Date,
    relationship: String,
    patientId: {
        type: String,
        index: true,
        validate: {
            isAsync: true,
            validator: (v: any, cb: (result: any, msg?: any) => {}) => {
                User.findOne({ "patients._id": v }, { "patients.$": 1 }, (err, patient: UserModel) => {
                    if (!patient)
                        cb(false);
                    else
                        cb(true);
                });
            },
            message: "{VALUE} is not a valid patient."
        }
    },
    userId: { type: String, index: true }
}, { timestamps: true });

export type FamilyModel = mongoose.Document & {
    firstName: string,
    lastName: string,
    birthDay: Date,
    relationship: string,
    patientId: string,
    userId: string
};

// export const User: UserType = mongoose.model<UserType>('Family', familySchema);
const Family = mongoose.model("Family", familySchema);
export default Family;
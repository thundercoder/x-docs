import mongoose from "mongoose";

export const familySchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    birthDay: Date,
    relationship: String,
    patientId: { type: String, index: true },
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
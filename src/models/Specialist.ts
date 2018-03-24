import mongoose from "mongoose";

export type SpecialistModel = mongoose.Document & {
    code: string,
    description: string
};

const specialistSchema = new mongoose.Schema({
    code: {type: String, unique: true},
    description: String,
}, {timestamps: true});

// export const Specialist: UserType = mongoose.model<UserType>('User', userSchema);
const Specialist = mongoose.model("Specialist", specialistSchema);
export default Specialist;
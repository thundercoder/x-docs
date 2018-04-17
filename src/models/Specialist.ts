import mongoose from 'mongoose';

export type SpecialistModel = mongoose.Document & {
    code: string,
    description: string,
    questions: QuestionModel[]
};

export type QuestionModel = {
    type: string,
    question: string,
    answer: string
};

const specialistSchema = new mongoose.Schema({
    code: {type: String, unique: true},
    description: String,
    questions: []
}, {timestamps: true});

// export const Specialist: UserType = mongoose.model<UserType>('User', userSchema);
const Specialist = mongoose.model('Specialist', specialistSchema);
export default Specialist;
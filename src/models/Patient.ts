import mongoose from "mongoose";

export const patientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    bodyPerson: {
        height: Number,
        weight: Number,
        color: String
    }
});

export type Patient = {
    firstName: string,
    lastName: string,
    bodyPerson: {
        height: number,
        weight: number,
        color: string
    }
};
import bcrypt from "bcrypt-nodejs";
import crypto from "crypto";
import mongoose from "mongoose";

import { default as Specialist, SpecialistModel } from "../models/Specialist";

export type UserModel = mongoose.Document & {
    email: string,
    password: string,
    passwordResetToken: string,
    passwordResetExpires: Date,

    facebook: string,
    tokens: AuthToken[],

    specialist: string,

    profile: {
        firstName: string,
        lastName: string,
        birthDate: Date,
        gender: string,
        phone: string,
        mobile: string,
        location: string,
        website: string,
        picture: string
    },

    patients: Patient[],

    active: boolean,

    comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void,
    gravatar: (size: number) => string
};

export type AuthToken = {
    accessToken: string,
    kind: string
};

export type Patient = {
    firstName: string,
    lastName: string,
    bodyPerson: {
        height: number,
        weight: number,
        color: string
    }
};

const patientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    bodyPerson: {
        height: Number,
        weight: Number,
        color: String
    }
});

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    facebook: String,
    twitter: String,
    google: String,
    tokens: Array,

    specialist: {
        type: String,
        validate: {
            isAsync: true,
            validator: (v: any, cb: (result: any, msg?: any) => {}) => {
                Specialist.findOne({ "code": v }, (err, specialist: SpecialistModel) => {
                    if (!specialist)
                        cb(false);
                    else
                        cb(true);
                });
            },
            message: "{VALUE} is not a valid specialist."
        }
    },

    profile: {
        firstName: String,
        lastName: String,
        birthDate: Date,
        gender: String,
        phone: String,
        mobile: String,
        website: String,
        picture: String
    },

    patients: [patientSchema],

    active: Boolean

}, {timestamps: true});

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword: string, cb: (err: any, isMatch: any) => {}) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};


/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size: number) {
    if (!size) {
        size = 200;
    }
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model("User", userSchema);
export default User;
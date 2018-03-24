import { default as User, UserModel, Patient } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "mongoose";

const request = require("express-validator");

/**
 * POST /patients/create
 * Create doctor's patient.
 */
export let postCreatePatient = (req: Request, res: Response, next: NextFunction) => {
    req.assert("firstName", "First Name cannot be blank.").notEmpty();
    req.assert("lastName", "Las Name cannot be blank.").notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({ errors: errors });
    }

    User.findById(req.user.id, (err, user: UserModel) => {
        if (err) return next(err);

        const patientModel: Patient = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            bodyPerson: {
                height: req.body.bodyPerson.height,
                weight: req.body.bodyPerson.weight,
                color: req.body.bodyPerson.color
            }
        };

        user.patients.push(patientModel);

        user.save((err) => {
            if (err) {
                if (err.name == "ValidationError") {
                    return res.status(400).send({ error: <ValidationError>err.errors[Object.keys(err.errors)[0]].message });
                }

                return next(err);
            }

            res.status(200).send({  ok: true, msg: "Patient information has been created." });
        });
    });
};

/**
 * GET /patients/{id}/patient
 * Get a simple patient of the list.
 */
export let getPatient = (req: Request, res: Response, next: NextFunction) => {
    User.findOne({ "_id": req.user.id, "patients._id": req.params.id }, { "patients.$": 1 }, (err, user: UserModel) => {
       if (err) return next(err);

       return res.status(200).send(user.patients[0]);
    });
};

/**
 * POST /patients/:id/update
 * Update a simple patient of the list.
 */
export let postUpdatePatient = (req: Request, res: Response, next: NextFunction) => {
    User.findOneAndUpdate({ "_id": req.user.id, "patients._id": req.body._id }, { "$set": { "patients.$": req.body } }, (err: any, user: any) => {
        if (err) return next(err);

        const patient = user.patients.id(req.params.id);

        patient.firstName = req.body.firstName;

        user.save((err: any) => {
            if (err) {
                if (err.name == "ValidationError") {
                    return res.status(400).send({ error: <ValidationError>err.errors[Object.keys(err.errors)[0]].message });
                }

                return next(err);
            }

            res.status(200).send({  ok: true, msg: "Patient information has been updated." });
        });
    });
};

/**
 * Get patients
 * Return a list of patients created.
 */
export let getPatients = (req: Request, res: Response, next: NextFunction) => {
    User.findOne({ "_id": req.user.id }, (err, user: UserModel) => {
        if (err) return next(err);

        return res.status(200).send(user.patients);
    });
};
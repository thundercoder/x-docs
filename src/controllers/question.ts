import { default as User, UserModel } from "../models/User";
import { QuestionModel } from "../models/Specialist";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "mongoose";

/**
 * POST /questions/create
 * Create doctor's backgruoud question.
 */
export let postCreateQuestion = (req: Request, res: Response, next: NextFunction) => {
    req.assert("type", "Type cannot be blank.").notEmpty();
    req.assert("question", "Question cannot be blank.").notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).send({ errors: errors });
    }

    User.findById(req.user.id, (err, user: UserModel) => {
        if (err) return next(err);

        const questionModel: QuestionModel = {
            type: req.body.type,
            question: req.body.question,
            answer: ""
        };

        user.questions.push(questionModel);

        user.save((err) => {
            if (err) {
                if (err.name == "ValidationError") {
                    return res.status(400).send({ error: <ValidationError>err.errors[Object.keys(err.errors)[0]].message });
                }

                return next(err);
            }

            res.status(200).send({  ok: true, msg: "Question has been created." });
        });
    });
};

/**
 * POST /questions/update
 * Update a questions' list.
 */
export let postUpdateQuestion = (req: Request, res: Response, next: NextFunction) => {
    User.findOneAndUpdate({ "_id": req.user.id }, { "$set": { "questions": req.body } }, (err: any, user: UserModel) => {
        if (err) return next(err);

        user.questions = req.body;

        user.save((err: any) => {
            if (err) {
                if (err.name == "ValidationError") {
                    return res.status(400).send({ error: <ValidationError>err.errors[Object.keys(err.errors)[0]].message });
                }

                return next(err);
            }

            res.status(200).send({  ok: true, msg: "Questions have been updated." });
        });
    });
};

/**
 * Get questions
 * Return a list of questions created.
 */
export let getQuestions = (req: Request, res: Response, next: NextFunction) => {
    User.findOne({ "_id": req.user.id }, (err, user: UserModel) => {
        if (err) return next(err);

        return res.status(200).send(user.questions);
    });
};
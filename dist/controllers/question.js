"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
/**
 * POST /questions/create
 * Create doctor's backgruoud question.
 */
exports.postCreateQuestion = (req, res, next) => {
    req.assert('type', 'Type cannot be blank.').notEmpty();
    req.assert('question', 'Question cannot be blank.').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        return res.status(400).send({ errors: errors });
    }
    User_1.default.findById(req.user.id, (err, user) => {
        if (err)
            return next(err);
        const questionModel = {
            type: req.body.type,
            question: req.body.question,
            answer: ''
        };
        user.questions.push(questionModel);
        user.save((err) => {
            if (err) {
                if (err.name == 'ValidationError') {
                    return res.status(400).send({ error: err.errors[Object.keys(err.errors)[0]].message });
                }
                return next(err);
            }
            res.status(200).send({ ok: true, msg: 'Question has been created.' });
        });
    });
};
/**
 * POST /questions/update
 * Update a questions' list.
 */
exports.postUpdateQuestion = (req, res, next) => {
    User_1.default.findOneAndUpdate({ '_id': req.user.id }, { '$set': { 'questions': req.body } }, (err, user) => {
        if (err)
            return next(err);
        user.questions = req.body;
        user.save((err) => {
            if (err) {
                if (err.name == 'ValidationError') {
                    return res.status(400).send({ error: err.errors[Object.keys(err.errors)[0]].message });
                }
                return next(err);
            }
            res.status(200).send({ ok: true, msg: 'Questions have been updated.' });
        });
    });
};
/**
 * Get questions
 * Return a list of questions created.
 */
exports.getQuestions = (req, res, next) => {
    User_1.default.findOne({ '_id': req.user.id }, (err, user) => {
        if (err)
            return next(err);
        return res.status(200).send(user.questions);
    });
};
//# sourceMappingURL=question.js.map
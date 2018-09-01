"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const Family_1 = __importDefault(require("../models/Family"));
/**
 * POST /family/create
 * Create patient's member family.
 */
exports.postCreateFamily = (req, res, next) => {
    req.assert('firstName', 'First Name cannot be blank.').notEmpty();
    req.assert('lastName', 'Las Name cannot be blank.').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        return res.status(400).send({ errors: errors });
    }
    Family_1.default.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDay: req.body.birthDay || undefined,
        relationship: req.body.relationship || undefined,
        userId: req.user.id,
        patientId: req.body.patientId
    }, (err) => {
        if (err) {
            if (err.name == 'ValidationError') {
                return res.status(400).send({ error: err.errors[Object.keys(err.errors)[0]].message });
            }
            return next(err);
        }
        res.status(200).send({ ok: true, msg: 'Family information has been created.' });
    });
};
/**
 * GET /family/{id}/family
 * Get a simple family of the list's patient.
 */
exports.getFamily = (req, res, next) => {
    Family_1.default.findOne({ '_id': req.params.id, 'userId': req.user.id }, (err, family) => {
        if (err)
            return next(err);
        if (!family)
            return res.status(400).send({ error: 'Family member not found.' });
        return res.status(200).send(family);
    });
};
/**
 * POST /family/:id/update
 * Update a simple family of the list's patient.
 */
exports.postUpdateFamily = (req, res, next) => {
    Family_1.default.findOneAndUpdate({
        '_id': req.body._id,
        'userId': req.user.id
    }, { '$set': { '$': req.body } }, (err, family) => {
        if (err)
            return next(err);
        family.firstName = req.body.firstName;
        family.lastName = req.body.lastName;
        family.birthDay = req.body.birthDay;
        family.relationship = req.body.relationship;
        family.patientId = req.body.patientId;
        family.userId = req.body.userId;
        family.save((err) => {
            if (err) {
                if (err.name == 'ValidationError') {
                    return res.status(400).send({ error: err.errors[Object.keys(err.errors)[0]].message });
                }
                return next(err);
            }
            res.status(200).send({ ok: true, msg: 'Family information has been updated.' });
        });
    });
};
/**
 * Get families
 * Return a list of families' patient created.
 */
exports.getFamilies = (req, res, next) => {
    Family_1.default.find({ 'patientId': req.params.patientId, 'userId': req.user.id }, (err, family) => {
        if (err)
            return next(err);
        return res.status(200).send(family);
    });
};
//# sourceMappingURL=family.js.map
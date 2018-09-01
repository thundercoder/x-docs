"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../models/Event"));
const Attachment_1 = __importDefault(require("../models/Attachment"));
const logger_1 = __importDefault(require("../util/logger"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const child_process_1 = __importDefault(require("child_process"));
const deleteFiles = util_1.promisify(fs_1.default.unlink);
const compressImages = util_1.promisify(child_process_1.default.exec);
/**
 * POST /events/create
 * Create patient's event.
 */
exports.postCreateEvent = (req, res, next) => {
    req.assert('cause', 'Cause cannot be blank.').notEmpty();
    req.assert('patientId', 'Patient cannot be blank.').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        return res.status(400).send({ error: errors[0].msg });
    }
    Event_1.default.create({
        cause: req.body.cause,
        resolution: req.body.resolution,
        patientId: req.body.patientId,
        backgroundQuestions: req.user.questions,
        attachments: req.body.attachments || '',
        userId: req.user.id
    }, (err, event) => {
        if (err) {
            if (err.name == 'ValidationError') {
                return res.status(400).send(err.errors[Object.keys(err.errors)[0]].message);
            }
            return next(err);
        }
        res.status(200).send({ ok: true, model: event, msg: 'Event information has been created.' });
    });
};
/**
 * GET /events/{id}/event
 * Get a simple event by id.
 */
exports.getEvent = (req, res, next) => {
    Event_1.default.findOne({ '_id': req.params.id, 'userId': req.user.id }, { 'cause': 1, 'resolution': 1, 'patientId': 1, 'backgroundQuestions': 1 }, (err, event) => {
        if (err)
            return next(err);
        if (!event)
            return res.status(404).send({ error: 'Event not found.' });
        return res.status(200).send(event);
    });
};
/**
 * POST /events/:id/update
 * Update a simple event of the patient.
 */
exports.postUpdateEvent = (req, res, next) => {
    Event_1.default.findOneAndUpdate({
        '_id': req.body._id,
        'userId': req.user.id
    }, { '$set': { '$': req.body } }, (err, event) => {
        if (err)
            return next(err);
        event.patientId = req.body.patientId;
        event.cause = req.body.cause;
        event.resolution = req.body.resolution;
        event.backgroundQuestions = req.body.backgroundQuestions;
        event.save((err) => {
            if (err) {
                if (err.name == 'ValidationError') {
                    return res.status(400).send({ error: err.errors[Object.keys(err.errors)[0]].message });
                }
                return next(err);
            }
            res.status(200).send({ ok: true, msg: 'Event information has been updated.' });
        });
    });
};
/**
 * Get events
 * Return a list of events.
 */
exports.getEvents = (req, res, next) => {
    let sortObj = {};
    let filterObj = {};
    if (req.query.criteria)
        filterObj = {
            'userId': req.user.id,
            $or: [
                { 'patientFullName': { $regex: new RegExp(req.query.criteria, 'gi') } },
                { 'cause': { $regex: new RegExp(req.query.criteria, 'gi') } }
            ]
        };
    else
        filterObj = {
            'userId': req.user.id
        };
    if (req.query.orderby)
        sortObj = {
            [req.query.orderby]: req.query.sorttype || 'asc'
        };
    Event_1.default.paginate(filterObj, {
        offset: +req.query.skip,
        limit: +req.query.take,
        select: {
            'attachments': 0
        },
        sort: sortObj,
        populate: ['userId', 'patientId']
    }, (err, events) => {
        if (err)
            logger_1.default.error(err);
        return res.status(200).send(events);
    });
};
/**
 * POST /events/attachments
 * Upload patient's attachments.
 */
exports.postCreateAttachmentEvent = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    req.assert('eventId', 'Event was not specified.').notEmpty();
    const errors = req.validationErrors();
    if (errors)
        return res.status(400).send({ error: errors[0].msg });
    if (!req.files)
        return res.status(400).send('No files were specified.');
    const file = req.files.attachments;
    // Move the file to a folder to be compressed
    file.mv('images-wrong/' + file.name, (err) => {
        if (err)
            next('There was a error saving the image');
        compressImages('node execute-compress-image.js')
            .then(() => {
            fs_1.default.readFile('images-good/' + file.name, (err, data) => {
                if (err)
                    return next(err);
                Attachment_1.default.create({
                    eventId: req.params.eventId,
                    data: data,
                    name: file.name,
                    mimetype: file.mimetype
                }, (err, attachment) => {
                    if (err) {
                        if (err.name == 'ValidationError') {
                            return res.status(400).send(err.errors[Object.keys(err.errors)[0]].message);
                        }
                        return next(err);
                    }
                });
            });
            deleteFiles('images-wrong/' + file.name);
            deleteFiles('images-good/' + file.name);
        });
    });
    return res.status(200).send({ ok: true, msg: 'Attachment has been uploaded.' });
});
/**
 * GET /events/{id}/attachments/{name}/download
 * Get a specific attachment from an event.
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @returns {Response}
 */
exports.getAttachmentEvent = (req, res, next) => {
    req.assert('id', 'Event was not specified.').notEmpty();
    const errors = req.validationErrors();
    if (errors)
        return res.status(403).send({ error: errors[0].msg });
    Attachment_1.default.findOne({ '_id': req.params.id }, (err, attachment) => {
        if (err)
            return next(err);
        if (!attachment)
            return res.status(404).send({ error: 'Attachment not found.' });
        res.contentType(attachment._doc.mimetype);
        res.send(attachment._doc.data);
    });
};
/**
 * GET /events/{id}/attachments
 * Get all attachments related of an event.
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @returns {Response}
 */
exports.getAttachmentsEvent = (req, res, next) => {
    req.assert('eventId', 'Event was not specified.').notEmpty();
    const errors = req.validationErrors();
    if (errors)
        return res.status(403).send({ error: errors[0].msg });
    Attachment_1.default.find({ 'eventId': req.params.eventId }, { 'data': 0 }, (err, attachments) => {
        if (err)
            return next(err);
        if (!attachments)
            return res.status(404).send({ error: 'Attachments not found.' });
        return res.status(200).send(attachments);
    });
};
/**
 * DELETE /events/{id}/attachment/{attachmentId}/delete
 * Remove an attachments related of an event.
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @returns {Response}
 */
exports.deleteAttachmentEvent = (req, res, next) => {
    req.assert('eventId', 'Event was not specified.').notEmpty();
    req.assert('attachmentId', 'Attachment was not specified.').notEmpty();
    const errors = req.validationErrors();
    if (errors)
        return res.status(400).send({ error: errors[0].msg });
    Attachment_1.default.deleteOne({ '_id': req.params.attachmentId, 'eventId': req.params.eventId }, (err) => {
        if (err)
            return next(err);
        return res.status(200).send({ ok: true, message: 'Attachment removed.' });
    });
};
//# sourceMappingURL=event.js.map
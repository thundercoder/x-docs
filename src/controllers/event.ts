import { default as Event, EventModel } from '../models/Event';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'mongoose';
import logger from '../util/logger';
import { FileArray, UploadedFile } from 'express-fileupload';
import { default as User, UserModel } from '../models/User';
import { removeErrorMarkup } from 'tslint/lib/verify/parse';
import { userInfo } from 'os';

/**
 * POST /events/create
 * Create patient's event.
 */
export let postCreateEvent = (req: Request, res: Response, next: NextFunction) => {
  req.assert('cause', 'First Name cannot be blank.').notEmpty();
  req.assert('resolution', 'Las Name cannot be blank.').notEmpty();
  req.assert('patientId', 'Las Name cannot be blank.').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).send({errors: errors});
  }

  Event.create({
    cause: req.body.cause,
    resolution: req.body.resolution,
    patientId: req.body.patientId,
    backgrundQuestions: req.body.backgrundQuestions,
    attachments: req.body.attachments || '',
    userId: req.user.id
  }, (err: any, event: any) => {
    if (err) {
      if (err.name == 'ValidationError') {
        return res.status(400).send(<ValidationError>err.errors[Object.keys(err.errors)[0]].message);
      }

      return next(err);
    }

    res.status(200).send({ok: true, model: event, msg: 'Event information has been created.'});
  });
};

/**
 * GET /events/{id}/event
 * Get a simple event by id.
 */
export let getEvent = (req: Request, res: Response, next: NextFunction) => {
  Event.findOne({'_id': req.params.id, 'userId': req.user.id}, (err: any, event: EventModel) => {
    if (err) return next(err);

    if (!event) return res.status(404).send({error: 'Event not found.'});

    return res.status(200).send(event);
  });
};

/**
 * POST /events/:id/update
 * Update a simple event of the patient.
 */
export let postUpdateEvent = (req: Request, res: Response, next: NextFunction) => {
  Event.findOneAndUpdate({
    '_id': req.body._id,
    'userId': req.user.id
  }, {'$set': {'$': req.body}}, (err: any, event: EventModel) => {
    if (err) return next(err);

    event.cause = req.body.cause;
    event.resolution = req.body.resolution;
    event.attachments = req.body.attachments;
    event.backgroundQuestions = req.body.backgroundQuestions;

    event.save((err: any) => {
      if (err) {
        if (err.name == 'ValidationError') {
          return res.status(400).send({error: <ValidationError>err.errors[ Object.keys(err.errors)[ 0 ] ].message});
        }

        return next(err);
      }

      res.status(200).send({ok: true, msg: 'Event information has been updated.'});
    });
  });
};

/**
 * Get events
 * Return a list of events.
 */
export let getEvents = (req: Request, res: Response, next: NextFunction) => {
  /*
  Event.find({ 'userId': req.user.id }, (err, event: EventModel) => {

    if (err) return next(err);

    return res.status(200).send(event);
  });
  */

  Event.find({ 'userId': req.user.id })
    .populate('userId')
    .exec(function (err, events) {
      if (err) logger.error(err);

      return res.status(200).send(events);
    });
};

/**
 * POST /events/attachments
 * Upload patient's attachments.
 */
export let postCreateAttachmentEvent = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  const file = <UploadedFile>req.files.attachments;

  Event.findOneAndUpdate({
    '_id': req.params.id,
    'userId': req.user.id
  }, {'$set': {'$': req.body}}, (err: any, event: EventModel) => {
    if (err) return next(err);

    event.attachments.push({
      data: file.data,
      name: file.name,
      mimetype: file.mimetype
    });

    event.save((err: any) => {
      if (err) {
        if (err.name == 'ValidationError') {
          return res.status(400).send({error: <ValidationError>err.errors[ Object.keys(err.errors)[ 0 ] ].message});
        }

        return next(err);
      }

      res.status(200).send({ok: true, msg: 'Event information has been updated.'});
    });
  });
};

/**
 * GET /events/:id/attachments/:name/download
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @returns {Response}
 */
export let getAttachmentEvent = (req: Request, res: Response, next: NextFunction) => {

  req.assert('id', 'Event was not specified.').notEmpty();
  req.assert('name', 'Attachment was not specified.').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.status(403).send(errors);
  }

  Event.findOne({ '_id': req.params.id, 'attachments.name': req.params.name, 'userId': req.user.id }, { 'attachments.$': 1 }, (err, attachment: any) => {
    if (err) return next(err);

    if (!attachment) return res.status(400).send({ error: 'Attachment not found.' });

    res.contentType(attachment._doc.attachments[0].mimetype);
    res.send(attachment._doc.attachments[0].data);
    // return res.status(200).send(attachment);
  });
};
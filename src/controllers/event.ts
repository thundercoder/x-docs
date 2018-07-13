import { default as Event, EventModel } from '../models/Event';
import { default as Attachment } from '../models/Attachment';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'mongoose';
import logger from '../util/logger';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import { promisify } from 'util';
import childProcess from 'child_process';

const deleteFiles = promisify(fs.unlink);
const compressImages = promisify(childProcess.exec);

/**
 * POST /events/create
 * Create patient's event.
 */
export let postCreateEvent = (req: Request, res: Response, next: NextFunction) => {
  req.assert('cause', 'Cause cannot be blank.').notEmpty();
  req.assert('patientId', 'Patient cannot be blank.').notEmpty();

  const errors = <any[]>req.validationErrors();

  if (errors) {
    return res.status(400).send({error: errors[ 0 ].msg});
  }

  Event.create({
    cause: req.body.cause,
    resolution: req.body.resolution,
    patientId: req.body.patientId,
    backgroundQuestions: req.user.questions,
    attachments: req.body.attachments || '',
    userId: req.user.id
  }, (err: any, event: any) => {
    if (err) {
      if (err.name == 'ValidationError') {
        return res.status(400).send(<ValidationError>err.errors[ Object.keys(err.errors)[ 0 ] ].message);
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
  Event.findOne({'_id': req.params.id, 'userId': req.user.id}, {'cause': 1, 'resolution': 1, 'patientId': 1, 'backgroundQuestions': 1}, (err: any, event: EventModel) => {
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

    event.patientId = req.body.patientId;
    event.cause = req.body.cause;
    event.resolution = req.body.resolution;
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
  let sortObj = {};
  let filterObj = {};

  if (req.query.criteria)
    filterObj = {
      'userId': req.user.id,
      $or: [
        {'patientFullName': {$regex: new RegExp(req.query.criteria, 'gi')}},
        {'cause': {$regex: new RegExp(req.query.criteria, 'gi')}}
      ]
    };
  else
    filterObj = {
      'userId': req.user.id
    };

  if (req.query.orderby)
    sortObj = {
      [ req.query.orderby ]: req.query.sorttype || 'asc'
    };

  Event.paginate(filterObj, {
    offset: +req.query.skip,
    limit: +req.query.take,
    select: {
      'attachments': 0
    },
    sort: sortObj,
    populate: [ 'userId', 'patientId' ]
  }, (err, events) => {
    if (err) logger.error(err);

    return res.status(200).send(events);
  });
};

/**
 * POST /events/attachments
 * Upload patient's attachments.
 */
export let postCreateAttachmentEvent = async (req: Request, res: Response, next: NextFunction) => {
  req.assert('eventId', 'Event was not specified.').notEmpty();

  const errors = <any[]>req.validationErrors();

  if (errors) return res.status(400).send({error: errors[ 0 ].msg});

  if (!req.files) return res.status(400).send('No files were specified.');

  const file = <UploadedFile>req.files.attachments;

  // Move the file to a folder to be compressed
  file.mv('images-wrong/' + file.name, (err: any) => {
    if (err)
      next('There was a error saving the image');

    compressImages('node execute-compress-image.js')
      .then(() => {
        fs.readFile('images-good/' + file.name, (err, data) => {
          if (err) return next(err);

          Attachment.create({
            eventId: req.params.eventId,
            data: data,
            name: file.name,
            mimetype: file.mimetype
          }, (err: any, attachment: any) => {
            if (err) {
              if (err.name == 'ValidationError') {
                return res.status(400).send(<ValidationError>err.errors[ Object.keys(err.errors)[ 0 ] ].message);
              }

              return next(err);
            }
          });
        });

        deleteFiles('images-wrong/' + file.name);
        deleteFiles('images-good/' + file.name);
      });
  });

  return res.status(200).send({ok: true, msg: 'Attachment has been uploaded.'});
};

/**
 * GET /events/{id}/attachments/{name}/download
 * Get a specific attachment from an event.
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @returns {Response}
 */
export let getAttachmentEvent = (req: Request, res: Response, next: NextFunction) => {
  req.assert('id', 'Event was not specified.').notEmpty();

  const errors = <any[]>req.validationErrors();

  if (errors) return res.status(403).send({error: errors[ 0 ].msg});

  Attachment.findOne({'_id': req.params.id}, (err, attachment: any) => {
    if (err) return next(err);

    if (!attachment) return res.status(404).send({error: 'Attachment not found.'});

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
export let getAttachmentsEvent = (req: Request, res: Response, next: NextFunction) => {
  req.assert('eventId', 'Event was not specified.').notEmpty();

  const errors = <any[]>req.validationErrors();

  if (errors) return res.status(403).send({error: errors[ 0 ].msg});

  Attachment.find({'eventId': req.params.eventId}, {'data': 0}, (err, attachments: any) => {
    if (err) return next(err);

    if (!attachments) return res.status(404).send({error: 'Attachments not found.'});

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
export let deleteAttachmentEvent = (req: Request, res: Response, next: NextFunction) => {
  req.assert('eventId', 'Event was not specified.').notEmpty();
  req.assert('attachmentId', 'Attachment was not specified.').notEmpty();

  const errors = <any[]>req.validationErrors();

  if (errors) return res.status(400).send({error: errors[ 0 ].msg});

  Attachment.deleteOne({'_id': req.params.attachmentId, 'eventId': req.params.eventId}, (err: any) => {
    if (err) return next(err);

    return res.status(200).send({ok: true, message: 'Attachment removed.'});
  });
};
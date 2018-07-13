import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'mongoose';
import { default as Patient, PatientModel } from '../models/Patient';
import logger from '../util/logger';

/**
 * POST /patients/create
 * Create doctor's patient.
 */
export let postCreatePatient = (req: Request, res: Response, next: NextFunction) => {
  req.assert('firstName', 'First Name cannot be blank.').notEmpty();
  req.assert('lastName', 'Last Name cannot be blank.').notEmpty();

  const errors = <any[]>req.validationErrors();

  if (errors) {
    return res.status(400).send({ ok: true, message: errors[0].msg });
  }

  Patient.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    mobile: req.body.mobile,
    bodyPerson: {
      height: req.body.bodyPerson.height,
      weight: req.body.bodyPerson.weight,
      color: req.body.bodyPerson.color
    },
    userId: req.user.id
  }, (err: any, patient: any) => {
    if (err) {
      if (err.name == 'ValidationError') {
        return res.status(400).send(<ValidationError>err.errors[Object.keys(err.errors)[0]].message);
      }

      return next(err);
    }

    res.status(200).send({ ok: true, model: patient, message: 'Patient information has been created.' });
  });
};

/**
 * GET /patients/{id}/patient
 * Get a simple patient of the list.
 */
export let getPatient = (req: Request, res: Response, next: NextFunction) => {
  Patient.findOne({ '_id': req.params.id, 'userId': req.user.id }, (err: any, patient: PatientModel) => {
    if (err) return next(err);

    if (!patient) return res.status(400).send({ok: false, message: 'Patient not found.'});

    return res.status(200).send(patient);
  });
};

/**
 * POST /patients/:id/update
 * Update a simple patient of the list.
 */
export let postUpdatePatient = (req: Request, res: Response, next: NextFunction) => {
  Patient.findOneAndUpdate({
    'userId': req.user.id,
    '_id': req.body._id
  }, { '$set': { '$': req.body } }, (err: any, patient: PatientModel) => {
    if (err) return next(err);

    patient.firstName = req.body.firstName;
    patient.lastName = req.body.lastName;
    patient.phone = req.body.phone;
    patient.mobile = req.body.mobile;
    patient.bodyPerson.height = req.body.bodyPerson.height;
    patient.bodyPerson.weight = req.body.bodyPerson.weight;
    patient.bodyPerson.color = req.body.bodyPerson.color;

    patient.save((err: any) => {
      if (err) {
        if (err.name == 'ValidationError') {
          return res.status(400).send({error: <ValidationError>err.errors[ Object.keys(err.errors)[ 0 ] ].message});
        }

        return next(err);
      }

      res.status(200).send({ok: true, message: 'Patient information has been updated.'});
    });
  });
};

/**
 * Get patients
 * Return a list of patients created.
 */
export let getPatients = (req: Request, res: Response, next: NextFunction) => {
  let sortObj = {};
  let filterObj = {};

  if (req.query.criteria)
    filterObj = {
      'userId': req.user.id,
      $or: [
        {'firstName': {$regex: new RegExp(req.query.criteria, 'gi')}},
        {'lastName': {$regex: new RegExp(req.query.criteria, 'gi')}},
        {'phone': {$regex: new RegExp(req.query.criteria, 'gi')}},
        {'mobile': {$regex: new RegExp(req.query.criteria, 'gi')}}
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

  Patient.paginate(filterObj, {
    offset: +req.query.skip,
    limit: +req.query.take,
    sort: sortObj
  }, (err, patients) => {
    if (err) logger.error(err);

    return res.status(200).send(patients);
  });
};
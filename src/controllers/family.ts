import { default as Family, FamilyModel } from '../models/Family';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'mongoose';

/**
 * POST /family/create
 * Create patient's member family.
 */
export let postCreateFamily = (req: Request, res: Response, next: NextFunction) => {
  req.assert('firstName', 'First Name cannot be blank.').notEmpty();
  req.assert('lastName', 'Las Name cannot be blank.').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).send({errors: errors});
  }

  Family.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthDay: req.body.birthDay || undefined,
    relationship: req.body.relationship || undefined,
    userId: req.user.id,
    patientId: req.body.patientId
  }, (err: any) => {
    if (err) {
      if (err.name == 'ValidationError') {
        return res.status(400).send({error: <ValidationError>err.errors[ Object.keys(err.errors)[ 0 ] ].message});
      }

      return next(err);
    }

    res.status(200).send({ok: true, msg: 'Family information has been created.'});
  });
};

/**
 * GET /family/{id}/family
 * Get a simple family of the list's patient.
 */
export let getFamily = (req: Request, res: Response, next: NextFunction) => {
  Family.findOne({'_id': req.params.id, 'userId': req.user.id}, (err, family: FamilyModel) => {
    if (err) return next(err);

    if (!family) return res.status(400).send({error: 'Family member not found.'});

    return res.status(200).send(family);
  });
};

/**
 * POST /family/:id/update
 * Update a simple family of the list's patient.
 */
export let postUpdateFamily = (req: Request, res: Response, next: NextFunction) => {
  Family.findOneAndUpdate({
    '_id': req.body._id,
    'userId': req.user.id
  }, {'$set': {'$': req.body}}, (err: any, family: FamilyModel) => {
    if (err) return next(err);

    family.firstName = req.body.firstName;
    family.lastName = req.body.lastName;
    family.birthDay = req.body.birthDay;
    family.relationship = req.body.relationship;
    family.patientId = req.body.patientId;
    family.userId = req.body.userId;

    family.save((err: any) => {
      if (err) {
        if (err.name == 'ValidationError') {
          return res.status(400).send({error: <ValidationError>err.errors[ Object.keys(err.errors)[ 0 ] ].message});
        }

        return next(err);
      }

      res.status(200).send({ok: true, msg: 'Family information has been updated.'});
    });
  });
};

/**
 * Get families
 * Return a list of families' patient created.
 */
export let getFamilies = (req: Request, res: Response, next: NextFunction) => {
  Family.find({'patientId': req.params.patientId, 'userId': req.user.id}, (err, family: FamilyModel) => {
    if (err) return next(err);

    return res.status(200).send(family);
  });
};
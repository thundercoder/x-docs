import async from 'async';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import passport from 'passport';
import { default as User, UserModel, AuthToken } from '../models/User';
import { Request, Response, NextFunction } from 'express';
import { IVerifyOptions } from 'passport-local';
import { WriteError } from 'mongodb';
import { ValidationError } from 'mongoose';
import { default as Specialist, SpecialistModel } from '../models/Specialist';
import { UploadedFile } from 'express-fileupload';
import { promisify } from 'util';
import fs from 'fs';
import childProcess from 'child_process';

const deleteFiles = promisify(fs.unlink);
const compressImages = promisify(childProcess.exec);

/**
 * GET /login
 * Login page.
 */
export let getLogin = (req: Request, res: Response) => {
  User.findOne({ _id: req.user._id }, { 'profile.picture': 0 }, (err, currentUser) => {
    if (err)
      return res.status(404).send({ ok: false, message: 'User doesn\'t exist' });

    return res.status(200).send(currentUser);
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
export let postLogin = (req: Request, res: Response, next: NextFunction) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({gmail_remove_dots: false});

  const errors = <any[]>req.validationErrors();

  if (errors)
    res.status(400).send({ error: errors[0].msg});

  passport.authenticate('local', (err: Error, user: UserModel, info: IVerifyOptions) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(403).send({error: info.message});
    }

    if (!user.active) {
      return res.status(403).send({error: 'Your account is not actived, please contact help support for further information.'});
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(200).send({ok: true, msg: 'Success! You are logged in.'});
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
export let logout = (req: Request, res: Response) => {
  req.logout();
  res.redirect('/');
};

/**
 * POST /account/upload/picture
 * Upload user's photo.
 */
export let postUploadPicture = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) return res.status(400).send({ ok: false, message: 'No files were specified.' });

  const file = <UploadedFile>req.files.attachments;

  // Move the file to a folder to be compressed
  file.mv('images-wrong/' + file.name, (err: any) => {
    if (err)
      next('There was a error saving the image');

    compressImages('node execute-compress-image.js')
      .then(() => {
        fs.readFile('images-good/' + file.name, (err, data) => {
          if (err) return next(err);

          User.findByIdAndUpdate({ _id: req.user._id }, {'$set': { '$': req.body }}, (err: any, model: any) => {
            model.profile.picture = data;

            model.save();
          });
        });

        deleteFiles('images-wrong/' + file.name);
        deleteFiles('images-good/' + file.name);
      });
  });

  return res.status(200).send({ok: true, msg: 'Picture has been uploaded.'});
};

/**
 * GET /account/get/picture
 * Get the picture related of an user.
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @returns {Response}
 */
export let getUserPicture = (req: Request, res: Response, next: NextFunction) => {
  User.findOne({ _id: req.user._id }, (err: any, user: any) => {
    if (err) return next(err);

    if (!user) return res.status(404).send({error: 'Picture not found.'});

    res.contentType('image/jpeg');
    res.send(user.profile.picture);
  });
};

/**
 * GET /signup
 * Signup page.
 */
export let getSignup = (req: Request, res: Response) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
export let postSignup = (req: Request, res: Response, next: NextFunction) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len({min: 4});
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({gmail_remove_dots: false});

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({email: req.body.email}, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      req.flash('errors', {msg: 'Account with that email address already exists.'});
      return res.redirect('/signup');
    }
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
};

/**
 * GET /account
 * Profile page.
 */
export let getAccount = (req: Request, res: Response) => {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * GET /specialists
 * Update profile information.
 */
export let getSpecialists = (req: Request, res: Response, next: NextFunction) => {
  // Looking for questions belong Specialist given
  Specialist.find({}, { _id: 1, code: 1, description: 1 }, (err, specialist: SpecialistModel[]) => {
    if (specialist.length > 0)
      return res.status(200).send(specialist);

     return res.status(404).send({ ok: true, message: 'Specialists not found.' });
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
export let postUpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({gmail_remove_dots: false});

  const errors = <any[]>req.validationErrors();

  if (errors) {
    return res.status(400).send({ ok: false, message: errors[0].msg });
  }

  User.findById(req.user.id, (err, user: UserModel) => {
    if (err) {
      return next(err);
    }

    // Looking for questions belong Specialist given if it has been changed
    if (user.specialist != req.body.specialist)
      Specialist.findOne({'code': req.body.specialist}, (err, specialist: SpecialistModel) => {
        if (specialist)
          user.questions = specialist.questions;
      });
    else
      user.questions = req.body.questions;

    user.email = req.body.email || '';
    user.specialist = req.body.specialist || '';
    user.profile.firstName = req.body.profile.firstName || '';
    user.profile.lastName = req.body.profile.lastName || '';
    user.profile.birthDate = req.body.profile.birthDate || '';
    user.profile.phone = req.body.profile.phone || '';
    user.profile.mobile = req.body.profile.mobile || '';
    user.profile.gender = req.body.profile.gender || '';
    user.profile.address = req.body.profile.address || '';
    user.profile.website = req.body.profile.website || '';

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          return res.status(400).send({ ok: false, message: 'The email address you have entered is already associated with an account.' });
        }

        if (err.name == 'ValidationError') {
          return res.status(400).send({ok: false, message: <ValidationError>err.errors[ Object.keys(err.errors)[ 0 ] ].message});
        }

        return next(err);
      }
      return res.status(200).send({ ok: true, msg: 'Profile information has been updated.' });
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
export let postUpdatePassword = (req: Request, res: Response, next: NextFunction) => {
  req.assert('password', 'Password must be at least 4 characters long').len({min: 4});
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user: UserModel) => {
    if (err) {
      return next(err);
    }
    user.password = req.body.password;
    user.save((err: WriteError) => {
      if (err) {
        return next(err);
      }
      req.flash('success', {msg: 'Password has been changed.'});
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
export let postDeleteAccount = (req: Request, res: Response, next: NextFunction) => {
  User.remove({_id: req.user.id}, (err) => {
    if (err) {
      return next(err);
    }
    req.logout();
    req.flash('info', {msg: 'Your account has been deleted.'});
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
export let getOauthUnlink = (req: Request, res: Response, next: NextFunction) => {
  const provider = req.params.provider;
  User.findById(req.user.id, (err, user: any) => {
    if (err) {
      return next(err);
    }
    user[ provider ] = undefined;
    user.tokens = user.tokens.filter((token: AuthToken) => token.kind !== provider);
    user.save((err: WriteError) => {
      if (err) {
        return next(err);
      }
      req.flash('info', {msg: `${provider} account has been unlinked.`});
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
export let getReset = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({passwordResetToken: req.params.token})
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('errors', {msg: 'Password reset token is invalid or has expired.'});
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
export let postReset = (req: Request, res: Response, next: NextFunction) => {
  req.assert('password', 'Password must be at least 4 characters long.').len({min: 4});
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function resetPassword(done: Function) {
      User
        .findOne({passwordResetToken: req.params.token})
        .where('passwordResetExpires').gt(Date.now())
        .exec((err, user: any) => {
          if (err) {
            return next(err);
          }
          if (!user) {
            req.flash('errors', {msg: 'Password reset token is invalid or has expired.'});
            return res.redirect('back');
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save((err: WriteError) => {
            if (err) {
              return next(err);
            }
            req.logIn(user, (err) => {
              done(err, user);
            });
          });
        });
    },
    function sendResetPasswordEmail(user: UserModel, done: Function) {
      const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      const mailOptions = {
        to: user.email,
        from: 'express-ts@starter.com',
        subject: 'Your password has been changed',
        text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
      };
      transporter.sendMail(mailOptions, (err) => {
        req.flash('success', {msg: 'Success! Your password has been changed.'});
        done(err);
      });
    }
  ], (err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
export let getForgot = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
export let postForgot = (req: Request, res: Response, next: NextFunction) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({gmail_remove_dots: false});

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function createRandomToken(done: Function) {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString('hex');
        done(err, token);
      });
    },
    function setRandomToken(token: AuthToken, done: Function) {
      User.findOne({email: req.body.email}, (err, user: any) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          req.flash('errors', {msg: 'Account with that email address does not exist.'});
          return res.redirect('/forgot');
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        user.save((err: WriteError) => {
          done(err, token, user);
        });
      });
    },
    function sendForgotPasswordEmail(token: AuthToken, user: UserModel, done: Function) {
      const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      const mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com',
        subject: 'Reset your password on Hackathon Starter',
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };
      transporter.sendMail(mailOptions, (err) => {
        req.flash('info', {msg: `An e-mail has been sent to ${user.email} with further instructions.`});
        done(err);
      });
    }
  ], (err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/forgot');
  });
};

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
const async_1 = __importDefault(require("async"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const passport_1 = __importDefault(require("passport"));
const User_1 = __importDefault(require("../models/User"));
const Specialist_1 = __importDefault(require("../models/Specialist"));
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const child_process_1 = __importDefault(require("child_process"));
const deleteFiles = util_1.promisify(fs_1.default.unlink);
const compressImages = util_1.promisify(child_process_1.default.exec);
/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
    User_1.default.findOne({ _id: req.user._id }, { 'profile.picture': 0 }, (err, currentUser) => {
        if (err)
            return res.status(404).send({ ok: false, message: 'User doesn\'t exist' });
        return res.status(200).send(currentUser);
    });
};
/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    const errors = req.validationErrors();
    if (errors)
        res.status(400).send({ error: errors[0].msg });
    passport_1.default.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(403).send({ error: info.message });
        }
        if (!user.active) {
            return res.status(403).send({ error: 'Your account is not actived, please contact help support for further information.' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).send({ ok: true, msg: 'Success! You are logged in.' });
        });
    })(req, res, next);
};
/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};
/**
 * POST /account/upload/picture
 * Upload user's photo.
 */
exports.postUploadPicture = (req, res, next) => {
    if (!req.files)
        return res.status(400).send({ ok: false, message: 'No files were specified.' });
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
                User_1.default.findByIdAndUpdate({ _id: req.user._id }, { '$set': { '$': req.body } }, (err, model) => {
                    model.profile.picture = data;
                    model.save();
                });
            });
            deleteFiles('images-wrong/' + file.name);
            deleteFiles('images-good/' + file.name);
        });
    });
    return res.status(200).send({ ok: true, msg: 'Picture has been uploaded.' });
};
/**
 * GET /account/get/picture
 * Get the picture related of an user.
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @returns {Response}
 */
exports.getUserPicture = (req, res, next) => {
    User_1.default.findOne({ _id: req.user._id }, (err, user) => {
        if (err)
            return next(err);
        if (!user)
            return res.status(404).send({ error: 'Picture not found.' });
        res.contentType('image/jpeg');
        res.send(user.profile.picture);
    });
};
/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
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
exports.postSignup = (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len({ min: 4 });
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup');
    }
    const user = new User_1.default({
        email: req.body.email,
        password: req.body.password
    });
    User_1.default.findOne({ email: req.body.email }, (err, existingUser) => {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            req.flash('errors', { msg: 'Account with that email address already exists.' });
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
exports.getAccount = (req, res) => {
    res.render('account/profile', {
        title: 'Account Management'
    });
};
/**
 * GET /specialists
 * Update profile information.
 */
exports.getSpecialists = (req, res, next) => {
    // Looking for questions belong Specialist given
    Specialist_1.default.find({}, { _id: 1, code: 1, description: 1 }, (err, specialist) => {
        if (specialist.length > 0)
            return res.status(200).send(specialist);
        return res.status(404).send({ ok: true, message: 'Specialists not found.' });
    });
};
/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    req.assert('email', 'Please enter a valid email address.').isEmail();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    const errors = req.validationErrors();
    if (errors) {
        return res.status(400).send({ ok: false, message: errors[0].msg });
    }
    User_1.default.findById(req.user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        // Looking for questions belong Specialist given if it has been changed
        if (user.specialist != req.body.specialist)
            Specialist_1.default.findOne({ 'code': req.body.specialist }, (err, specialist) => {
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
                    return res.status(400).send({ ok: false, message: err.errors[Object.keys(err.errors)[0]].message });
                }
                return next(err);
            }
            return res.status(200).send({ ok: true, msg: 'Profile information has been updated.' });
        });
    });
});
/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
    req.assert('password', 'Password must be at least 4 characters long').len({ min: 4 });
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
    }
    User_1.default.findById(req.user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user.password = req.body.password;
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', { msg: 'Password has been changed.' });
            res.redirect('/account');
        });
    });
};
/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
    User_1.default.remove({ _id: req.user.id }, (err) => {
        if (err) {
            return next(err);
        }
        req.logout();
        req.flash('info', { msg: 'Your account has been deleted.' });
        res.redirect('/');
    });
};
/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
    const provider = req.params.provider;
    User_1.default.findById(req.user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user[provider] = undefined;
        user.tokens = user.tokens.filter((token) => token.kind !== provider);
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.flash('info', { msg: `${provider} account has been unlinked.` });
            res.redirect('/account');
        });
    });
};
/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    User_1.default
        .findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec((err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
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
exports.postReset = (req, res, next) => {
    req.assert('password', 'Password must be at least 4 characters long.').len({ min: 4 });
    req.assert('confirm', 'Passwords must match.').equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('back');
    }
    async_1.default.waterfall([
        function resetPassword(done) {
            User_1.default
                .findOne({ passwordResetToken: req.params.token })
                .where('passwordResetExpires').gt(Date.now())
                .exec((err, user) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
                    return res.redirect('back');
                }
                user.password = req.body.password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                user.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    req.logIn(user, (err) => {
                        done(err, user);
                    });
                });
            });
        },
        function sendResetPasswordEmail(user, done) {
            const transporter = nodemailer_1.default.createTransport({
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
                req.flash('success', { msg: 'Success! Your password has been changed.' });
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
exports.getForgot = (req, res) => {
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
exports.postForgot = (req, res, next) => {
    req.assert('email', 'Please enter a valid email address.').isEmail();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/forgot');
    }
    async_1.default.waterfall([
        function createRandomToken(done) {
            crypto_1.default.randomBytes(16, (err, buf) => {
                const token = buf.toString('hex');
                done(err, token);
            });
        },
        function setRandomToken(token, done) {
            User_1.default.findOne({ email: req.body.email }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    req.flash('errors', { msg: 'Account with that email address does not exist.' });
                    return res.redirect('/forgot');
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                user.save((err) => {
                    done(err, token, user);
                });
            });
        },
        function sendForgotPasswordEmail(token, user, done) {
            const transporter = nodemailer_1.default.createTransport({
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
                req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
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
//# sourceMappingURL=user.js.map
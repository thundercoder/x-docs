import express from 'express';
import compression from 'compression';
import session from 'express-session';
import bodyParser from 'body-parser';
import logger from './util/logger';
import lusca from 'lusca';
import dotenv from 'dotenv';
import mongo from 'connect-mongo';
import flash from 'express-flash';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import expressValidator from 'express-validator';
import bluebird from 'bluebird';
import { MONGODB_URI, SESSION_SECRET } from './util/secrets';
import fileUpload from 'express-fileupload';

const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({path: '.env.example'});

// Controllers (route handlers)
import * as homeController from './controllers/home';
import * as userController from './controllers/user';
import * as apiController from './controllers/api';
import * as contactController from './controllers/contact';
import * as patientController from './controllers/patient';
import * as familyController from './controllers/family';
import * as questionController from './controllers/question';
import * as eventController from './controllers/event';


// API keys and Passport configuration
import * as passportConfig from './config/passport';

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl, {useMongoClient: true}).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  },
).catch(err => {
  console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
  // process.exit();
});

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(fileUpload());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
    req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/api/login', userController.getLogin);
app.post('/api/login', userController.postLogin);
app.get('/api/logout', userController.logout);
app.get('/api/forgot', userController.getForgot);
app.post('/api/forgot', userController.postForgot);
app.get('/api/reset/:token', userController.getReset);
app.post('/api/reset/:token', userController.postReset);
app.get('/api/signup', userController.getSignup);
app.post('/api/signup', userController.postSignup);
app.get('/api/contact', contactController.getContact);
app.post('/api/contact', contactController.postContact);
app.get('/api/account', passportConfig.isAuthenticated, userController.getAccount);
app.put('/api/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/api/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/api/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/api/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);
app.post('/api/account/upload/picture', passportConfig.isAuthenticated, userController.postUploadPicture);
app.get('/api/account/get/picture', passportConfig.isAuthenticated, userController.getUserPicture);

app.post('/api/patients/create', passportConfig.isAuthenticated, patientController.postCreatePatient);
app.put('/api/patients/:id/update', passportConfig.isAuthenticated, patientController.postUpdatePatient);
app.get('/api/patients/:id/patient', passportConfig.isAuthenticated, patientController.getPatient);
app.get('/api/patients', passportConfig.isAuthenticated, patientController.getPatients);

app.post('/api/families/create', passportConfig.isAuthenticated, familyController.postCreateFamily);
app.put('/api/families/:id/update', passportConfig.isAuthenticated, familyController.postUpdateFamily);
app.get('/api/families/:id/family', passportConfig.isAuthenticated, familyController.getFamily);
app.get('/api/families/:patientId/list', passportConfig.isAuthenticated, familyController.getFamilies);

app.get('/api/specialists', passportConfig.isAuthenticated, userController.getSpecialists);

app.post('/api/questions/create', passportConfig.isAuthenticated, questionController.postCreateQuestion);
app.put('/api/questions/update', passportConfig.isAuthenticated, questionController.postUpdateQuestion);
app.get('/api/questions/list', passportConfig.isAuthenticated, questionController.getQuestions);

app.post('/api/events/create', passportConfig.isAuthenticated, eventController.postCreateEvent);
app.put('/api/events/:id/update', passportConfig.isAuthenticated, eventController.postUpdateEvent);
app.get('/api/events/:id/event', passportConfig.isAuthenticated, eventController.getEvent);
app.get('/api/events/list', passportConfig.isAuthenticated, eventController.getEvents);
app.post('/api/events/attachments/:eventId', passportConfig.isAuthenticated, eventController.postCreateAttachmentEvent);
app.get('/api/events/attachments/:id/download', passportConfig.isAuthenticated, eventController.getAttachmentEvent);
app.get('/api/events/:eventId/attachments', passportConfig.isAuthenticated, eventController.getAttachmentsEvent);
app.delete('/api/events/:eventId/attachment/:attachmentId/delete', passportConfig.isAuthenticated, eventController.deleteAttachmentEvent);

/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/facebook', passport.authenticate('facebook', {scope: [ 'email', 'public_profile' ]}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login'}), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


export default app;
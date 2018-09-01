"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const lusca_1 = __importDefault(require("lusca"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const express_flash_1 = __importDefault(require("express-flash"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const express_validator_1 = __importDefault(require("express-validator"));
const bluebird_1 = __importDefault(require("bluebird"));
const secrets_1 = require("./util/secrets");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const MongoStore = connect_mongo_1.default(express_session_1.default);
// Load environment variables from .env file, where API keys and passwords are configured
dotenv_1.default.config({ path: '.env.example' });
// Controllers (route handlers)
const homeController = __importStar(require("./controllers/home"));
const userController = __importStar(require("./controllers/user"));
const apiController = __importStar(require("./controllers/api"));
const contactController = __importStar(require("./controllers/contact"));
const patientController = __importStar(require("./controllers/patient"));
const familyController = __importStar(require("./controllers/family"));
const questionController = __importStar(require("./controllers/question"));
const eventController = __importStar(require("./controllers/event"));
// API keys and Passport configuration
const passportConfig = __importStar(require("./config/passport"));
// Create Express server
const app = express_1.default();
// Connect to MongoDB
const mongoUrl = secrets_1.MONGODB_URI;
mongoose_1.default.Promise = bluebird_1.default;
mongoose_1.default.connect(mongoUrl, { useMongoClient: true }).then(() => {
}).catch(err => {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    // process.exit();
});
// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.set('views', path_1.default.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(compression_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_validator_1.default());
app.use(express_fileupload_1.default());
app.use(express_session_1.default({
    resave: true,
    saveUninitialized: true,
    secret: secrets_1.SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_flash_1.default());
app.use(lusca_1.default.xframe('SAMEORIGIN'));
app.use(lusca_1.default.xssProtection(true));
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
    }
    else if (req.user &&
        req.path == '/account') {
        req.session.returnTo = req.path;
    }
    next();
});
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
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
app.get('/auth/facebook', passport_1.default.authenticate('facebook', { scope: ['email', 'public_profile'] }));
app.get('/auth/facebook/callback', passport_1.default.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});
app.get('/*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public/index.html'));
});
exports.default = app;
//# sourceMappingURL=app.js.map
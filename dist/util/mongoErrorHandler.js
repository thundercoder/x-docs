"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mongoErrorHandler(err, req, res, next) {
    if (err) {
        if (err.code === 11000) {
            req.flash("errors", { msg: "The email address you have entered is already associated with an account." });
            return res.redirect("/account");
        }
        if (err.name == "ValidationError") {
            return res.status(400).send({ error: err.errors[Object.keys(err.errors)[0]].message });
        }
        return next(err);
    }
}
exports.mongoErrorHandler = mongoErrorHandler;
//# sourceMappingURL=mongoErrorHandler.js.map
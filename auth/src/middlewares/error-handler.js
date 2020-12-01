const express = require('express');
const {
    ParameterError,
    RequestValidationError
} = require('@intch/common');

/**
 * 
 * @param {Error} err 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const errorHandler = (err, req, res, next) => {
    if (err) {
        if (err instanceof RequestValidationError) {
            return res.status(err.statusCode)
            .send({ errors: err.serializeErrors() });
        } else if (err instanceof ParameterError) {
            return res.status(err.statusCode)
                .send(err);
        } else {
            return res.status(500)
            .send({ errors: [ { message: 'something went wrong!!' } ] });
        }
    }

    next();
}

module.exports = {
    errorHandler
};
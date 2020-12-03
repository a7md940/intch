const express = require('express');
const {
    ParameterError,
    RequestValidationError,
    DuplicateEntityError
} = require('@intch/common');
const { ConflictException } = require('@intch/common/http-excptions');

/**
 * 
 * @param {Error} err 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const excuteHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res);
        } catch (exc) {
            console.error(exc);
            if (exc) {
                if (exc instanceof RequestValidationError) {
                    return res.status(exc.statusCode)
                        .send({ errors: exc.serializeErrors() });
                } else if (exc instanceof ParameterError) {
                    return res.status(exc.statusCode)
                        .send(exc);
                } else if (exc instanceof DuplicateEntityError) {
                    const httpExc = new ConflictException(exc.message, exc.code);
                    return res.status(httpExc.statusCode)
                        .send(httpExc);
                } else {
                    return res.status(500)
                        .send({ errors: [{ message: 'something went wrong!!' }] });
                }
            }

            next();
        }
    }
}
module.exports = excuteHandler;

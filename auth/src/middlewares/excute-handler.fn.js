const express = require('express');
const {
    ParameterError,
    RequestValidationError,
    DuplicateEntityError,
    NotFoundError
} = require('@intch/common');
const { ConflictException } = require('@intch/common/http-excptions');
const HttpExceptionsBase = require('@intch/common/http-excptions/http-exceptions-base');
const NotFoundExcpetion = require('@intch/common/http-excptions/note-found.exception');

/**
 * 
 * @param {(req, res, next) => void} fn 
 */
const excuteHandler = (fn) => {
    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     * @param {import('express').NextFunction} next 
     */
    const handle = async (req, res, next) => {
        try {
            await fn(req, res, next);
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
                } else if (exc instanceof HttpExceptionsBase) {
                    return res.status(exc.statusCode)
                        .send(exc);
                } else if (exc instanceof NotFoundError) {
                    const httpExc = new NotFoundExcpetion(exc.message, exc.code);
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
    return handle;
}
module.exports = excuteHandler;

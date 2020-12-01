const express = require('express');
const { BaseError } = require('@intch/common');

/**
 * 
 * @param {Error} err 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const errorHandler = (err, req, res, next) => {
    console.error(err);
    const exc = new BaseError('Error here', 500)
    console.error(exc)
}

module.exports = { errorHandler };
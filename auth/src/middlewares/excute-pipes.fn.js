/**
 * Function to handle the validation pipes middlewares.
 * @param {(val) => void} fn transform function
 * @returns {(req: Express.Request, res: Express.Response, next: Express.NextFunction) => void}
 */
module.exports = (fn) => {
    return (req, res, next) => {
        req.body = fn(req.body);
        next();
    }
}
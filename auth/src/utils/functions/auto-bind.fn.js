/**
 * Bind functions context
 * @param {any} klass Class instance `{this} keyword` to bind the contrllers function contexts
 */
module.exports = (klass) => {
    let isFunction = (v) => typeof v === 'function';
    let proto = Object.getPrototypeOf(klass);
    let propertyNames = Object.getOwnPropertyNames(proto)
    for (var _iterator = propertyNames, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
        var _ref;

        if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
        } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
        }

        var name = _ref;

        var value = proto[name];
        if (isFunction(value)) {
            klass[name] = proto[name].bind(klass);
        }
    }
}
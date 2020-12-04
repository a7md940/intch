/**
 * 
 * @param {string[]} keys properties to convert
 * @param {object} obj Data object
 */
module.exports = (keys, obj) => {
    const result = Object.assign(obj);
    for (const key of keys) {
        if (result[key] == undefined) {
            result[key] = null;
        }
    }
    return result;
}

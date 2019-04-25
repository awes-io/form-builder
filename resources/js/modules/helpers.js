/**
 * Google reCaptcha form field name, reused in components
 *
 * @const {String} CAPTCHA_NAME - form field name
 */

export const CAPTCHA_NAME = 'g-recaptcha-response'


/**
 * Restores flatted single-level object to a nested object
 *
 * @param {Object} obj - flattened object
 * @param {Object} converter - function to convert value
 *
 * @returns {Object} restored object
 *
 */

export function restoreFlattenedObject(obj, converter = null) {

    let result = {}

    for (let key in obj) {

        // get value to set, apply converter if exists
        let _value = converter ? converter(obj[key]) : obj[key]

        AWES.utils.object.set(result, key, _value)
    }

    return result
}


/**
 * Normalizes given object path to default value
 *
 * Example: input `arr.0.spaced value` converts to `arr[0]['spaced value']`
 *
 * @param {String} path - path to normalize
 *
 * @returns {String} normalized path
 */

export function normalizePath(path) {
    return path && path.split(/(?:\]?\.|\[(?:\'|\")?|(?:\'|\")?\])/g)
                        .filter(val => val !== '')
                        .map(key => {
                            return key.match(/^\d+$/) ?
                                    '[' + key + ']' :
                                    (key.match(/ /) ? '[\'' + key + '\']' : '.' + key )
                        })
                        .join('')
                        .replace(/^\./, '')
}


/**
 * Normalizes unordered indexes in array
 *
 * @param {Array} arr - array to normalize
 *
 * @returns {Array} normalized array
 */

export function _normalizeArrayIndexes(arr) {
    return arr.filter( () => true )
}


/**
 * Normalizes unordered indexes in arrays of given object
 *
 * @param {Object} obj - required, object with arrays to normalize
 * @param {Array} paths - required, paths to arrays
 *
 * @returns {Object} object with normalized arrays
 */

export function normalizeArrayIndexes(obj, paths) {
    const { get, set } = AWES.utils.object
    paths.forEach( path => {
        let _arr = get(obj, path)
        set(obj, path, _normalizeArrayIndexes(_arr))
    })
    return obj
}
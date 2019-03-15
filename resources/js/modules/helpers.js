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
 * Check for empty object and arrays
 *
 * @param {Object|Array} obj - object to check
 *
 * @returns {Boolean} is empty or not
 */

export function isEmpty(obj) {
    return Array.isArray(obj) ? !obj.length : !Object.keys(obj).length
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


/**
 *
 * @param {Object} obj1 - object to compare
 * @param {Object} obj2 - object to compare
 * @param {Function} converter - vunction to convert value
 *
 * @returns {Boolean} true if objects are equal, false otherwise
 */

export function compareFlatObjects(obj1, obj2, converter = null) {

    let _keys1 = Object.keys(obj1)
    let _keys2 = Object.keys(obj2)

    // fast compare by length
    if ( _keys1.length !== _keys2.length ) {
        return false
    }


    // long compare by keys
    let equal = true

    for ( let i = 0; i < _keys1.length; i++ ) {
        let _key1 = _keys1[i]
        let _key2 = _keys2[i]

        if (_key1 !== _key2) {
            equal = false
            break
        }

        let _val1 = converter ? converter(obj1[_key1]) : obj1[_key1];
        let _val2 = converter ? converter(obj2[_key1]) : obj2[_key1];
        if ( _val1 !== _val2 ) {
            equal = false
            break
        }
    }

    return equal
}
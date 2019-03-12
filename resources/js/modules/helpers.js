/**
 * Google reCaptcha form field name, reused in components
 *
 * @const {String} CAPTCHA_NAME - form field name
 */

export const CAPTCHA_NAME = 'g-recaptcha-response'


/**
 * Detects if the given value is an object litheral
 *
 * @param {*} val - a variable to check
 *
 */

export function _isPlainObject(val) {
    return val != null && typeof val == 'object'
}


/**
 * Internal function to flatten a nested object
 *
 * @param {Object} obj - the object to flatten
 * @param {Object} root - the root object, **for internal recursive calls**
 * @param {String} rootName - parent key, **for internal recursive calls**
 * @param {Boolean} isArray - if the given key type is Array, **for internal recursive calls**
 *
 * @returns {Object} flattened object
 *
 */

export function _flattenObject(obj, root, rootName, converter = null) {

    let isArray = Array.isArray(obj)

    // TODO: improve build system to remove comments in production mode
    /*
    if ( isArray && ! rootName ) {
        throw new Error('Root name must be provided to flatten an array with `_flattenObject` function')
    }
    */

    for (let key in obj) {

        // current key value
        let val = obj[key]

        // check for blank space to wrap in [' brackets ']
        let _hasSpace = / /.test(key)


        // build the key name
        let _key = key

        if (_hasSpace) {
            _key = '\[\'' + key + '\'\]'
        } else if (isArray) {
            _key = '\[' + key + '\]'
        } else if (rootName) {
            _key = '.' + key
        }


        if ( Array.isArray(val) || _isPlainObject(val) ) {

            // recursive call for arrays and objects
            _flattenObject(val, root, rootName + _key, converter)

        } else {

            // get value to set, apply converter if exists
            let _value = converter ? converter(val) : val

            // assignin the value
            root[rootName + _key] = _value
        }
    }

    return root
}


/**
 * Flattens a nested object to single-level form
 *
 * @param {Object} obj - the object to flatten
 * @param {Object} converter - function to convert value
 *
 * @returns {Object} flattened object
 *
 */

export function flattenObject(obj, converter = null) {

    return _flattenObject(obj, {}, '', converter)
}


/**
 * Sets value in object by given path array
 *
 * @param {Object} obj - flattened object
 * @param {Array} path - path levels
 * @param {*} value - value to set
 *
 */

export function _set(obj, path, value) {

    // create a path array of levels from a flattened key
    let _path = _pathToArray(path)

    // set current object level
    let current = obj


    do {

        // get next key and replace quots in keys with spaces
        let _key = _path.shift()

        // check if its a middle or last key
        if ( _path.length ) {

            // skip if a structure with such key exists
            if ( ! current[_key] ) {

                // creaate an array if next key is numeric or an object otherwise
                let nextStructure = isNaN(_path[0]) ? {} : []
                current[_key] = nextStructure
            }

            // go a level deeper for next iteration
            current = current[_key]

        } else {

            // if this is a last key, set it`s value
            current[_key] = value
        }
    } while (_path.length)
}


/**
 *
 * @param {String} path - path to valiable in object
 *
 * @returns {Array} array of levels to object
 */

export function _pathToArray(path) {
    return path.replace(/\'?\]$/, '').split(/(?:\]?\.|\[\'?|\'?\])/g)
}


/**
 * Get a value by given path
 *
 * @param {Object} obj - object to search
 * @param {String} path - path to level
 * @param {*} value - default value if nothig found
 *
 * @returns {*} value of given path in object
 */

export function _get(obj, path, value) {
    path = _pathToArray(path)
    let current = obj
    while ( path.length && current ) {
        let key = path.shift()
        if ( path.length ) {
            current = current[key]
        } else if ( typeof current[key] !== 'undefined' ) {
            value = current[key]
        }
    }
    return value
}


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

        _set(result, key, _value)
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
    paths.forEach( path => {
        let _arr = _get(obj, path)
        _set(obj, path, _normalizeArrayIndexes(_arr))
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
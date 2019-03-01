import {
    isEmpty,
    flattenObject,
    restoreFlattenedObject,
    normalizeArrayIndexes,
    compareFlatObjects,
    normalizePath,
    CAPTCHA_NAME
} from '../modules/helpers'

const flattenFileds = fields => flattenObject(fields, val => ({ value: val }))
const restoreFields = fields => restoreFlattenedObject(fields, val => val.value)
const checkEdited = form => {
    if ( ! form.watchEdit ) return
    let equal = compareFlatObjects(form.initialState, form.fields, val => val.value)
    Vue.set(form, 'isEdited', !equal)
}

export const state = () => ({})

export const getters = {

    form: state => name => {
        return state[name]
    },

    fields: (state, getters) => name => {
        let fields = {}
        const form = getters.form(name)
        if ( form ) {
            Object.keys(form.fields).forEach(field => fields[field] = form.fields[field].value)
        }
        return fields
    },

    errorsOrFalse: (state, getters) => name => {
        let errors = {}
        const form = getters.form(name)
        if (form) {
            Object.keys(form.fields).forEach(field => {
                let error = form.fields[field].error
                if (error) errors[field] = error
            })
        }
        return isEmpty(errors) ? false : errors
    },

    hasCaptchaError: (state, getters) => name => {
        const errors = getters.form(name)
        return !!errors[CAPTCHA_NAME]
    },

    isLoading: (state, getters) => name => {
        const form = getters.form(name)
        return form && form.isLoading
    },

    isMultiblockDisabled: (state, getters) => (formName, multiblockName) => {
        const form = getters.form(name)
        return form && !form.multiblocksDisabled[multiblockName]
    },

    field: (state, getters) => (formName, fieldName) => {
        const form = getters.form(formName)
        return form && form.fields[fieldName]
    },

    fieldValue: (state, getters) => (formName, fieldName) => {
        const field = getters.field(formName, fieldName)
        return field && field.value
    },

    fieldError: (state, getters) => (formName, fieldName) => {
        const field = getters.field(formName, fieldName)
        return field && field.error
    },

    multiblockGroupIds: (state, getters) => (formName, multiblockName) => {
        const form = getters.form(formName)
        const groupRegExp = new RegExp('^' + multiblockName + '\\[(\\d)\\]')
        const groupIds = []
        form && Object.keys(form.fields).forEach( fieldName => {
            let found = fieldName.match(groupRegExp)
            let id = found && +found[1]
            if (id !== null && !groupIds.includes(id)) {
                groupIds.push(id)
            }
        })
        return groupIds
    },

    firstErrorField: state => formName => {
        return state[formName] && state[formName].firstErrorField
    }
}

export const mutations = {

    createForm(state, {formName, fields}) {
        Vue.set(state, formName, {
            initialState: flattenFileds(fields), // no shallow copys
            fields: flattenFileds(fields),
            watchEdit: ! isEmpty(fields),
            multiblocksDisabled: {},
            isLoading: false,
            isEdited: isEmpty(fields),
            firstErrorField: null
        })
    },

    setLoading(state, {formName, status}) {
        Vue.set(state[formName], 'isLoading', status)
    },

    deleteForm(state, formName) {
        Vue.delete(state, formName)
    },

    setFormErrors(state, {formName, errors}) {
        const form = state[formName]
        Vue.set(form, 'firstErrorField', Object.keys(errors)[0])
        for ( let fieldName in errors ) {
            let _fieldName = normalizePath(fieldName)
            Vue.set(form.fields[_fieldName], 'error', errors[fieldName])
        }
    },

    createField(state, { formName, fieldName, value }) {
        const form = state[formName]
        Vue.set(form.fields, fieldName, { value })
        checkEdited(form)
    },

    setFieldValue(state, { formName, fieldName, value }) {
        const form = state[formName]
        Vue.set(form.fields[fieldName], 'value', value)
        checkEdited(form)
    },

    deleteField(state, { formName, fieldName }) {
        const form = state[formName]
        Vue.delete(form.fields, fieldName)
        checkEdited(form)
    },

    resetError(state, { formName, fieldName }) {
        Vue.delete(state[formName].fields[fieldName], 'error')
    },

    resetFirstErrorField(state, formName) {
        Vue.set(state[formName], 'firstErrorField', null)
    },

    toggleMultiblockState(state, { formName, multiblockName, status }) {
        Vue.set(state[formName].multiblocksDisabled, multiblockName, status)
    },

    /**
     * Cleanup related data if it exists, but not used in multiblock, because of rendering empty spaces
     */
    deleteMultiblockBlock: (state, { formName, multiblockName, id }) => {
        const blockRegExp = new RegExp('^' + multiblockName + `\\[${id}\\]`)
        Object.keys(state[formName].fields).filter( field => {
            let found = field.match(blockRegExp)
            return found && found[0]
        }).map( fieldName => {
            Vue.delete(state[formName].fields, fieldName)
        })
    }
}

export const actions = {

    restoreData({ state }, { formName }) {
        const form = state[formName]

        // restore data object
        const data = restoreFields(form.fields)

        // convert data and normalize arrays if multiblocks exist
        const multiblockNames = Object.keys(form.multiblocksDisabled)
        if (multiblockNames.length) {
            normalizeArrayIndexes(data, multiblockNames)
        }

        // reset errors and set normalized multiblock indexes
        Vue.set(form, 'fields', flattenFileds(data))

        return data
    },

    sendForm({ state, commit, dispatch }, {formName, url, method}) {

        return new Promise( resolve => {

            let _res
            const form = state[formName]

            commit('setLoading', {formName, status:true})

            dispatch('restoreData', { formName })
                .then( data => {
                    // send request
                    return AWES.ajax(data, url, method)
                })
                .then( res => {
                    _res = res

                    if ( res.success ) {
                        // reset initial state
                        Vue.set(form, 'initialState', flattenFileds(res.data.data))
                        Vue.set(form, 'fields', flattenFileds(res.data.data))
                        if ( form.watchEdit ) Vue.set(form, 'isEdited', false)
                    } else if (res.data) {
                        commit('setFormErrors', {formName, errors: res.data})
                    }
                })
                .finally( () => {
                    commit('setLoading', { formName, status: false })
                    resolve( _res )
                })
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
}
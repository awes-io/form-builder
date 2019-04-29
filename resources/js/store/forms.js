import {
    restoreFlattenedObject,
    normalizeArrayIndexes,
    normalizePath,
    CAPTCHA_NAME
} from '../modules/helpers'

function checkEdited(form) {
    if ( ! form.isEdited ) {
        Vue.set(form, 'isEdited', true)
    }
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
            fields = form.fields
        }
        return fields
    },

    multiblockIds: (state, getters) => (formName, multiblockName) => {
        let multiblockIds = [0]
        const form = getters.form(formName)
        if (form) {
            multiblockIds = form.multiblocks[multiblockName].ids
        }
        return multiblockIds
    },

    errorsOrFalse: (state, getters) => name => {
        const form = getters.form(name)
        let errors = form && form.errors || {}
        return AWES.utils.object.isEmpty(errors) ? false : errors
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

    fieldValue: (state, getters) => (formName, fieldName) => {
        const form = getters.form(formName)
        return form && form.fields[fieldName]
    },

    fieldError: (state, getters) => (formName, fieldName) => {
        const form = getters.form(formName)
        return form && form.errors[fieldName]
    },

    firstErrorField: state => formName => {
        return state[formName] && state[formName].firstErrorField
    }
}

export const mutations = {

    createForm(state, {formName, fields}) {
        Vue.set(state, formName, {
            initialState: fields,
            fields: {},
            errors: {},
            multiblocks: {},
            // selectValues: {},
            isLoading: false,
            isEdited: false,
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
        let _errors = {}
        for (let error in errors) {
            let _value = errors[error]
            _errors[normalizePath(error)] = _value
        }
        Vue.set(form, 'errors', _errors)
    },

    createField(state, { formName, fieldName, value }) {
        const form = state[formName]
        value = AWES.utils.object.get(form.initialState, fieldName, value)
        Vue.set(form.fields, fieldName, value)
    },

    setFieldValue(state, { formName, fieldName, value }) {
        const form = state[formName]
        Vue.set(form.fields, fieldName, value)
        checkEdited(form)
    },

    deleteField(state, { formName, fieldName }) {
        const form = state[formName]
        Vue.delete(form.fields, fieldName)
        Vue.delete(form.errors, fieldName)
    },

    resetError(state, { formName, fieldName }) {
        Vue.delete(state[formName].errors, fieldName)
    },

    resetErrors(state, formName) {
        Vue.set(state[formName], 'errors', {})
    },

    resetFirstErrorField(state, formName) {
        Vue.set(state[formName], 'firstErrorField', null)
    },

    createMutiblock(state, { formName, multiblockName, disabled }) {
        const form = state[formName]
        const { get, isEmpty } = AWES.utils.object
        let blocks = get(form.initialState, multiblockName)
        blocks = isEmpty(blocks) ? [{}] : blocks
        let ids = Object.keys(blocks).map(id => Number(id))
        Vue.set(form.multiblocks, multiblockName, {
            disabled,
            ids
        })
    },

    deleteMutiblock(state, { formName, multiblockName }) {
        Vue.delete(state[formName].multiblocks, multiblockName)
    },

    toggleMultiblockState(state, { formName, multiblockName, status }) {
        Vue.set(state[formName].multiblocks[multiblockName], 'disabled', status)
    },

    addMultiblockId(state, { formName, multiblockName, id }) {
        const form = state[formName]
        form.multiblocks[multiblockName].ids.push(id)
        checkEdited(form)
    },

    deleteMultiblockId(state, { formName, multiblockName, id }) {
        const form = state[formName]
        let ids = form.multiblocks[multiblockName].ids
        let index = ids.findIndex( _id => _id === id )
        ids.splice(index, 1)
        checkEdited(form)
    },

    // setSelectValue(state, { formName, selectName, value }) {
    //     const form = state[formName]
    //     if ( value !== null ) {
    //         Vue.set(form.selectValues, selectName, value)
    //     } else {
    //         Vue.delete(form.selectValues, selectName)
    //     }
    // }
}

export const actions = {

    restoreData({ state }, { formName }) {
        const form = state[formName]

        // restore data object
        const data = restoreFlattenedObject(form.fields)

        // convert data and normalize arrays if multiblocks exist
        const multiblockNames = Object.keys(form.multiblocks)
        if (multiblockNames.length) {
            normalizeArrayIndexes(data, multiblockNames)
            for (let multiblockName of multiblockNames) {
                let ids = Object.keys(AWES.utils.object.get(data, multiblockName, [{}])).map(id => Number(id))
                Vue.set(form.multiblocks[multiblockName], 'ids', ids)
            }
        }

        return data
    },

    sendForm({ state, commit, dispatch }, {formName, url, method}) {

        return new Promise( resolve => {

            let _res
            const form = state[formName]

            commit('resetErrors', formName)

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
                        let data = res.data.data || {}
                        Vue.set(form, 'initialState', data)
                        let _data = {}
                        for (let field in form.fields) {
                            _data[field] = AWES.utils.object.get(data, field)
                        }
                        Vue.set(form, 'fields', _data)
                        Vue.set(form, 'isEdited', false)
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
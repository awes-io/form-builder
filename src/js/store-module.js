import reactiveUpdate from './utils/reactiveFormUpdate'

const FORM_SCHEMA = ({ id, url, method, storeData }) => {
  return {
    id,
    url,
    storeData,
    initialState: {
      _method: method
    },
    realFields: [],
    workingState: {},
    loading: false,
    isEdited: false,
    editCounter: 0,
    errors: {},
    firstErrorField: null,
    multiblockState: {}
  }
}


const state = {
  forms: []
}


const getters = {

  form: ( state ) => formId => {
    return state.forms.find( form => form.id == formId )
  },
  
  formErrorsOrFalse: ( state, getters ) => formId => {
    const errors = getters.form(formId).errors
    return Object.keys(errors).length ? errors : false
  },

  isEdited: ( state, getters ) => formId => {
    return getters.form(formId).isEdited
  },

  fieldValue: ( state, getters ) => ( formId, fieldName ) => {
    return _.get( getters.form(formId).workingState, fieldName )
  },

  fieldError: ( state, getters ) => ( formId, fieldName ) => {
    return _.get( getters.form(formId).errors, fieldName )
  },

  firstErrorField: ( state, getters ) => formId => {
    return getters.form(formId).firstErrorField
  },

  workingState: ( state, getters ) => formId => {
    const form = getters.form( formId );
    return form.workingState;
  },

  loading: ( state, getters ) => formId => {
    return getters.form(formId).loading
  },

  multiblockDisabled: ( state, getters ) => ( formId, multiblock ) => {
    return _.get( getters.form(formId).multiblockState, multiblock )
  },
 
  hasCaptchaError: ( state, getters ) => formId => {
    return getters.form(formId).errors.hasOwnProperty('g-recaptcha-response') ? true : false
  }
}


const mutations = {

  createForm( state, payload ) {
    if ( this.getters['form'](payload.id) ) {
      throw new Error(`Form with ID ${payload.id} already exists`)
    }
    state.forms.push( FORM_SCHEMA(payload) )
  },

  deleteForm( state, id ) {
    const formIndex = state.forms.findIndex( form => form.id === id);
    if ( formIndex !== -1 ) {
      Vue.delete( state.forms, formIndex)
    } else {
      console.warn('No form to delete with id: ' + id )
    }
  },

  setDefaultData( state, { id, fields }) {
    const form = this.getters['form'](id);
    form.initialState = _.merge( form.initialState,  _.cloneDeep( fields ) );
    form.workingState = _.cloneDeep( form.initialState );
  },

  resetFormEdited( state, id ) {
    const form = this.getters['form'](id);
    form.isEdited = false;
  },

  setErrors( state, { id, errors } ) {
    const form = this.getters['form'](id)
    form.firstErrorField = Object.keys(errors)[0]
    form.errors = errors
  },

  resetError( state, { id, fieldName }) {
    const form = this.getters['form'](id);
    if ( form ) {
      delete form.errors[fieldName];
      reactiveUpdate( state, id, `errors`, form.errors );
    }
  },

  resetErrors( state, id ) {
    this.getters['form'](id).errors = {};
  },

  renameError( state, { id, oldName, newName, message }) {
    const form = this.getters['form'](id);
    Vue.set( form.errors, newName, message )
    Vue.delete( form.errors, oldName );
  },

  setField( state, { id, fieldName, value, initial }) {
    reactiveUpdate( state, id, `workingState.${fieldName}`, value );
    const form = this.getters['form'](id);
    if ( initial ) form.realFields.push(fieldName)
    if ( initial !== true ) {
      form.editCounter += 1
      form.isEdited = true;
    }
  },

  unsetRealField( state, { id, fieldName }) {
    const form = this.getters['form'](id)
    if ( ! form ) return
    let index = form.realFields.indexOf(fieldName)
    Vue.delete(form.realFields, index)
  },

  toggleFormLoading( state, {id, isLoading }) {
    const form = this.getters['form'](id);
    form.loading = isLoading
  },

  toggleMultiblockState( state, {id, multiblock, value} ) {
    const form = this.getters['form'](id);
    reactiveUpdate( state, id, `multiblockState.${multiblock}`, value );
  },

  resetFirstErrorField( state, id ) {
    const form = this.getters['form'](id);
    form.firstErrorField = null
  }
}


export default {
  state,
  getters,
  mutations
}

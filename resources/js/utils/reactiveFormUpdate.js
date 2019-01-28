export default function reactiveUpdate( state, formId, fieldName, value ) {

  let form = state.forms.find( form => form.id == formId );
  const index = state.forms.findIndex( form => form.id == formId );

  value === null ? _.unset( form, fieldName ) : _.set( form, fieldName, value );

  Vue.set( state.forms, index, form ); // reactive update
}

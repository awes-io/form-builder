/**
 * Fires event on element
 * @param {string} type - required
 * @param {HTMLElement} element - required
 * @param {Object} - additional objects
 *
 * @fires element#type bubbles:true, cancelable:true
 *
 */

export default function triggerEvent(type, element, options) {

  function addEventOptions( event ) {
    if ( ! options || Object.keys(options).length === 0 ) return event;
    for( let option in options ) {
      event[option] = options[option]
    }
    return event
  }

  if (document.createEvent) {
    const event = new Event(type, { bubbles:true, cancelable:true });
    element.dispatchEvent( addEventOptions(event) );
  } else {
    const event = document.createEventObject();
    element.fireEvent('on' + type, addEventOptions(event) );
  }
}

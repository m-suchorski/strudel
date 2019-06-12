import handleError, { warn } from '../util/error';
import { createDecorator } from '../util/helpers';

const DELEGATE_EVENT_SPLITTER = /^(\S+)\s*(.*)$/;

const delegate = (element, eventName, selector, listener) => {
  if (selector) {
    element.on(eventName, selector, listener);
  } else {
    element.on(eventName, listener);
  }
};

/**
 * Event decorator - binds method to event based on the event string
 * @param {string} event
 * @returns (Function} decorator
 */
export default createDecorator((component, property, params) => {
  if (!params || !params[0]) {
    warn('Event descriptor must be provided for Evt decorator');
  }

  if (!component._events) {
    component._events = [];
  }

  const cb = function handler(...args) {
    try {
      component[property].apply(this, args);
    } catch (e) {
      handleError(e, component.constructor, 'component handler');
    }

    if (params[1]) {
      args[0].preventDefault();
    }
  };

  if (params && params[0]) {
    component._events[params[0]] = cb;

    const match = params[0].match(DELEGATE_EVENT_SPLITTER);
    if (match) {
      delegate(component.$element, match[1], match[2], cb.bind(component));
    }
  }
});

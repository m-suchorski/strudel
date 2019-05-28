import handleError, { warn } from '../util/error';

const supportedEvents = {
  scroll: 'scroll',
  resize: 'resize',
  orientationchange: 'orientationchange'
};

/**
 * Subscribe decorator - binds method to event based on the event string
 * @param {string} event
 * @returns (Function} decorator
 */
export default function decorator(event, preventDefault) {
  return function _decorator(klass, method) {
    if (!event) {
      warn('Subscribe type must be provided for Subscribe decorator');
    }

    if (!supportedEvents[event.toLowerCase()]) {
      warn('Provided event is not supported in Subscribe decorator');
    }

    if (!klass._subscribed) {
      klass._subscribed = [];
    }

    const cb = function handler(...args) {
      try {
        klass[method].apply(this, args);
      } catch (e) {
        handleError(e, klass.constructor, 'subscribe handler');
      }

      if (preventDefault) {
        args[0].preventDefault();
      }
    };

    klass._subscribed[event] = cb;
    window.addEventListener(supportedEvents[event], klass._subscribed[event]);
  };
}

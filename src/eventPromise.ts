import { EventEmitter as EventEmitter3 } from 'eventemitter3'
import { EventEmitter } from './EventEmitter.js'
import { EventMap } from './types.js'

/**
 * Promise wrapper for EventEmitter. Returns a promise that resolves when the event is emitted. Note
 * that if the event handler signature has more than one parameter, only the first parameter is
 * returned. If the event handler has no parameters, the promise resolves to `undefined`.
 */
export const eventPromise = async <T extends EventMap, K extends keyof T, P extends Parameters<T[K]>[0]>(
  emitter: EventEmitter<T> | EventEmitter3<T>,
  event: K
): Promise<P> => {
  return isEventEmitter3(emitter)
    ? new Promise(resolve => {
        type K = EventEmitter3.EventNames<T>
        emitter.once(event as unknown as K, ((data: P) => resolve(data)) as EventEmitter3.EventListener<T, K>)
      })
    : new Promise<P>(resolve => {
        emitter.once(event, (...args) => {
          const payload = args[0] as P
          resolve(payload)
        })
      })
}

// type guard to detect eventemitter3
function isEventEmitter3<T extends EventMap>(emitter: EventEmitter<T> | EventEmitter3<T>): emitter is EventEmitter3<T> {
  return (emitter as EventEmitter3<T>).eventNames !== undefined
}

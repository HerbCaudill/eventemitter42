import { EventEmitter as EventEmitter3 } from 'eventemitter3'
import { EventEmitter } from './EventEmitter.js'
import { EventMap } from './types.js'

/**
 * Promise wrapper for EventEmitter. Returns a promise that resolves when the event is emitted. Note
 * that if the event handler signature has more than one parameter, only the first parameter is
 * returned. If the event handler has no parameters, the promise resolves to `undefined`.
 *
 * Backwards compatible with eventemitter3, but doesn't give any type information for the payload:
 * The return type is always `any`.
 */
export const eventPromise = async <
  T extends EventMap, //
  K extends keyof T,
  P extends Parameters<T[K]>[0]
>(
  emitter: EventEmitter<T> | EventEmitter3<T>,
  event: K
) =>
  new Promise<P>(resolve => {
    type OnceFn = (event: K, listener: (payload: P) => void) => typeof emitter
    const once = emitter.once as unknown as OnceFn
    once.apply(emitter, [event, (payload: P) => resolve(payload as P)])
  })

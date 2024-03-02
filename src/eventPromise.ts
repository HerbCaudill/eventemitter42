import { EventEmitter } from './EventEmitter.js'
import { EventMap } from './types.js'

export const eventPromise = async <T extends EventMap, K extends keyof T, P extends Parameters<T[K]>[0]>(
  emitter: EventEmitter<T>,
  event: K
): Promise<P> => {
  return new Promise<P>(resolve => {
    emitter.on(event, (...args) => {
      const payload = args[0] as P
      resolve(payload)
    })
  })
}

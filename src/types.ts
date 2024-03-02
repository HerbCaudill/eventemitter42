/**
 * Map of EE objects. An `Events` instance is a plain object whose properties are event names.
 */
export type Events<T extends EventMap> = Record<keyof T, Array<ListenerEntry>>

/**
 * Representation of a single event listener.
 */
export type ListenerEntry = {
  /** The listener function. */
  fn: ListenerFn

  /** Specify if the listener is a one-time listener. */
  once: boolean
}

export type ListenerFn = (arg: any) => void

export type EventMap = Record<string, ListenerFn>

export type EventListener<T extends EventMap, K extends keyof T> = (arg?: Parameters<T[K]>[0]) => void

export type EventArg<T extends EventMap, K extends keyof T> = Parameters<EventListener<T, K>>[0]

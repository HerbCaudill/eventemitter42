/**
 * A map of event names to the listeners for that event.
 */
export type ListenerMap<T extends EventMap, K extends keyof T = keyof T> = Record<K, Array<ListenerEntry<T, K>>>

/**
 * Representation of a single event listener.
 */
export type ListenerEntry<T extends EventMap, K extends keyof T> = {
  /** The listener function. */
  fn: EventListener<T, K>

  /** Specify if the listener is a one-time listener. */
  once: boolean
}

export type ListenerFn = (...args: any[]) => void

export type EventMap = Record<string | symbol | number, ListenerFn>

export type EventListener<T extends EventMap, K extends keyof T> = (...args: Parameters<T[K]>) => void

export type EventArgs<T extends EventMap, K extends keyof T> = Parameters<EventListener<T, K>>

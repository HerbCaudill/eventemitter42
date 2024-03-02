import type { ListenerEntry, EventMap, EventArgs, EventListener, ListenerMap } from './types.js'

export class EventEmitter<T extends EventMap = {}> {
  #listenerMap = {} as ListenerMap<T>
  #eventsCount = 0

  /** Calls each of the listeners registered for a given event. */
  emit<K extends keyof T>(event: K, ...args: EventArgs<T, K>): boolean {
    if (!this.#listenerMap[event]) return false
    const listeners = [...this.#listenerMap[event]]

    for (let i = 0; i < listeners.length; i++) {
      const { once, fn } = listeners[i]
      if (once) this.removeListener(event, fn)
      fn(...args)
    }
    return true
  }

  /** Add a listener for a given event. */
  addListener<K extends keyof T>(event: K, fn: EventListener<T, K>) {
    return this.#addListener(event, fn, false)
  }
  on = this.addListener

  /** Add a one-time listener for a given event. */
  once<K extends keyof T>(event: K, fn: EventListener<T, K>) {
    return this.#addListener(event, fn, true)
  }

  removeListener<K extends keyof T>(event: K, fn?: EventListener<T, K>) {
    const listeners = this.#listenerMap[event]
    if (listeners) {
      if (!fn) {
        this.removeAllListeners(event)
      } else {
        // find the listener
        const removals = []
        for (let i = 0; i < listeners.length; i++) {
          if (listeners[i].fn === fn) {
            const listener = listeners[i]
            // remove this listener
            this.#eventsCount -= 1
            if (this.#eventsCount === 0) {
              // if there are no more listeners, reset the events object
              this.#listenerMap = {} as ListenerMap<T>
              this.#eventsCount = 0
            } else if (listeners.length === 1) {
              // if this is the last listener, remove the key
              delete this.#listenerMap[event]
            } else {
              // remove this listener from the array
              removals.push(i)
            }
          }
        }
        for (let i = removals.length - 1; i >= 0; i--) {
          listeners.splice(removals[i], 1)
        }
      }
      return this
    }
  }
  off = this.removeListener

  removeAllListeners(event?: keyof T) {
    if (event) {
      const listeners = this.#listenerMap[event]
      // just remove listeners for this event
      if (listeners) {
        this.#eventsCount -= listeners.length
        if (this.#eventsCount === 0) {
          // if there are no more listeners, reset the events object
          this.#listenerMap = {} as ListenerMap<T>
        } else {
          // remove the key
          delete this.#listenerMap[event]
        }
      }
    } else {
      this.#listenerMap = {} as ListenerMap<T>
      this.#eventsCount = 0
    }

    return this
  }

  #addListener<K extends keyof T>(event: K, fn: EventListener<T, K>, once: boolean = false) {
    const listener = { fn, once } as ListenerEntry<T, K>
    const events = this.#listenerMap[event] ?? []
    events.push(listener)
    this.#listenerMap[event] = events
    this.#eventsCount++
    return this
  }
}

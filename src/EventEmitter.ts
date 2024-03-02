import type { Events, ListenerEntry, EventMap, EventArg, EventListener, ListenerFn } from './types.js'

export class EventEmitter<T extends EventMap = {}> {
  #events = {} as Events<T>
  #eventsCount = 0

  /** Calls each of the listeners registered for a given event. */
  emit<K extends keyof T>(event: K, arg?: EventArg<T, K>): boolean {
    if (!this.#events[event]) return false
    const listeners = [...this.#events[event]]

    for (let i = 0; i < listeners.length; i++) {
      const { once, fn } = listeners[i]
      if (once) this.removeListener(event, fn)
      fn(arg)
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
    const listeners = this.#events[event]
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
              this.#events = {} as Events<T>
              this.#eventsCount = 0
            } else if (listeners.length === 1) {
              // if this is the last listener, remove the key
              delete this.#events[event]
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
      const listeners = this.#events[event]
      // just remove listeners for this event
      if (listeners) {
        this.#eventsCount -= listeners.length
        if (this.#eventsCount === 0) {
          // if there are no more listeners, reset the events object
          this.#events = {} as Events<T>
        } else {
          // remove the key
          delete this.#events[event]
        }
      }
    } else {
      this.#events = {} as Events<T>
      this.#eventsCount = 0
    }

    return this
  }
  #addListener<K extends keyof T>(event: K, fn: EventListener<T, K>, once: boolean = false) {
    const listener: ListenerEntry = { fn, once }
    const events = this.#events[event] ?? []
    events.push(listener)
    this.#events[event] = events
    this.#eventsCount++
    return this
  }
}

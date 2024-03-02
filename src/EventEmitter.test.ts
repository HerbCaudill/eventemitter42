import { describe, it, expect } from 'vitest'
import { EventEmitter } from './EventEmitter.js'

class TestEmitter extends EventEmitter<{
  foo: (arg: string) => void
  bar: (arg: number) => void
  baz: (arg: boolean[]) => void
}> {}

describe('EventEmitter', () => {
  it('instantiates correctly', () => {
    const e = new TestEmitter()
    expect(e).is.instanceOf(TestEmitter)
    expect(e).is.instanceOf(EventEmitter)
  })

  describe('emit', function () {
    it('returns false when there are not events to emit', function () {
      const e = new TestEmitter()

      expect(e.emit('foo')).equals(false)
      expect(e.emit('bar')).equals(false)
    })

    it('returns true when there are events to emit', function () {
      const e = new TestEmitter()
      let i = 0

      e.on('foo', () => i++)

      expect(e.emit('foo')).equals(true)
      // @ts-expect-error
      expect(e.emit('foob')).equals(false)

      expect(i).equals(1)
    })

    it('receives the emitted events', function () {
      const e = new TestEmitter()
      e.on('foo', arg => expect(arg).equals('pizza'))
      e.emit('foo', 'pizza')
    })

    it('emits to all event listeners', function () {
      const e = new TestEmitter()
      const results: string[] = []

      e.on('foo', () => {
        results.push('once')
      })

      e.on('foo', () => {
        results.push('again')
      })

      e.emit('foo')

      expect(results.join(';')).equals('once;again')
    })
  })

  describe('once', () => {
    it('only emits once', () => {
      const e = new TestEmitter()
      var i = 0

      e.once('foo', () => {
        i++
      })

      e.emit('foo')
      e.emit('foo')
      e.emit('foo')
      e.emit('foo')
      e.emit('foo')

      expect(i).equals(1)
    })

    it('only emits once if emits are nested inside the listener', () => {
      const e = new TestEmitter()
      let i = 0

      e.once('foo', () => {
        i++
        e.emit('foo')
      })

      e.emit('foo')
      expect(i).equals(1)
    })

    it('only emits once for multiple events', () => {
      const e = new TestEmitter()
      let a = 0
      let b = 0
      let c = 0

      e.once('foo', () => a++)
      e.once('foo', () => b++)
      e.on('foo', () => c++)

      e.emit('foo')
      e.emit('foo')
      e.emit('foo')
      e.emit('foo')
      e.emit('foo')

      expect(a).equals(1)
      expect(b).equals(1)
      expect(c).equals(5)
    })
  })

  describe('removeListener', () => {
    it('removes all listeners when the listener is not specified', () => {
      const e = new TestEmitter()

      let i = 0

      e.on('foo', () => i++)
      e.on('foo', () => i++)

      e.emit('foo')
      expect(i).equals(2)

      i = 0

      e.removeListener('foo')

      e.emit('foo')
      e.emit('foo')
      e.emit('foo')
      expect(i).equals(0)
    })

    it('removes only the listeners matching the specified listener', () => {
      const e = new TestEmitter()

      let i = 0

      const foo = () => i++
      const bar = () => i++

      e.on('foo', foo)
      e.on('foo', foo)
      e.on('bar', bar)

      e.removeListener('foo', foo)

      e.emit('foo')
      e.emit('bar')

      expect(i).equals(1)

      e.removeListener('foo', foo)
    })
  })

  describe('removeAllListeners', () => {
    it('removes all events for the specified events', () => {
      const e = new TestEmitter()

      e.on('foo', () => {
        throw new Error()
      })
      e.on('foo', () => {
        throw new Error()
      })
      e.on('bar', () => {
        throw new Error()
      })

      e.removeAllListeners('foo')

      expect(e.emit('foo')).equals(false)
      expect(() => e.emit('bar')).toThrow()
    })

    it('removes all events if no event is specified', () => {
      const e = new TestEmitter()

      e.on('foo', () => {
        throw new Error()
      })
      e.on('foo', () => {
        throw new Error()
      })
      e.on('bar', () => {
        throw new Error()
      })

      e.removeAllListeners()

      expect(e.emit('foo')).equals(false)
      expect(e.emit('bar')).equals(false)
    })
  })
})

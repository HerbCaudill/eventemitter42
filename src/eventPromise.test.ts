import { expectTypeOf } from 'expect-type'
import { describe, it } from 'vitest'
import { EventEmitter } from './EventEmitter.js'
import { eventPromise } from './eventPromise.js'
import { EventEmitter as EventEmitter3 } from 'eventemitter3'

type TestEvents = {
  foo: (payload: { fee: string; fi: number[] }) => void
  bar: (fo: number, fum: boolean) => void
  baz: () => void
}

class TestEmitter extends EventEmitter<TestEvents> {
  doFoo() {
    setTimeout(() => this.emit('foo', { fee: 'fee', fi: [1, 2, 3] }), 5)
  }

  doBar() {
    setTimeout(() => this.emit('bar', 5, true))
  }

  doBaz() {
    setTimeout(() => this.emit('baz'), 5)
  }
}

describe('eventPromise', () => {
  it('return values should be correctly typed', async () => {
    const testEmitter = new TestEmitter()

    // if there is 1 parameter, it is returned
    testEmitter.doFoo()
    const { fee, fi } = await eventPromise(testEmitter, 'foo')
    expectTypeOf(fee).toEqualTypeOf<string>()
    expectTypeOf(fi).toEqualTypeOf<number[]>()

    // if there are 2+ parameters, only the first paramter is returned
    testEmitter.doBar()
    const fo = await eventPromise(testEmitter, 'bar')
    expectTypeOf(fo).toEqualTypeOf<number>()

    // if there are no parameters, undefined is returned
    testEmitter.doBaz()
    const baz = await eventPromise(testEmitter, 'baz')
    expectTypeOf(baz).toEqualTypeOf<undefined>()
  })

  it('should enforce types of return values', async () => {
    const testEmitter = new TestEmitter()

    testEmitter.doFoo()
    const { fee } = await eventPromise(testEmitter, 'foo') // ✅

    testEmitter.doFoo()
    // @ts-expect-error
    const { boo } = await eventPromise(testEmitter, 'foo') // ❌
  })

  it('can be used with eventemitter3', async () => {
    class TestEmitter3 extends EventEmitter3<TestEvents> {
      doFoo() {
        setTimeout(() => this.emit('foo', { fee: 'fee', fi: [1, 2, 3] }), 5)
      }

      doBar() {
        setTimeout(() => this.emit('bar', 5, true))
      }

      doBaz() {
        setTimeout(() => this.emit('baz'), 5)
      }
    }
    const testEmitter = new TestEmitter()

    // if there is 1 parameter, it is returned
    testEmitter.doFoo()
    const { fee, fi } = await eventPromise(testEmitter, 'foo')
    expectTypeOf(fee).toEqualTypeOf<string>()
    expectTypeOf(fi).toEqualTypeOf<number[]>()

    // if there are 2+ parameters, only the first paramter is returned
    testEmitter.doBar()
    const fo = await eventPromise(testEmitter, 'bar')
    expectTypeOf(fo).toEqualTypeOf<number>()

    // if there are no parameters, undefined is returned
    testEmitter.doBaz()
    const baz = await eventPromise(testEmitter, 'baz')
    expectTypeOf(baz).toEqualTypeOf<undefined>()
  })
})

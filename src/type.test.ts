import { expectTypeOf } from 'expect-type'
import { describe, it } from 'vitest'
import { EventEmitter } from './EventEmitter.js'
import { eventPromise } from './eventPromise.js'

type TestEvents = {
  foo: (payload: { fee: string; fi: number[] }) => void
  bar: (payload: { fo: number; fum: boolean }) => void
}

class TestEmitter extends EventEmitter<TestEvents> {}

describe('eventPromise', () => {
  it('return values should be correctly typed', async () => {
    const testEmitter = new TestEmitter()
    setTimeout(() => testEmitter.emit('foo', { fee: 'fee', fi: [1, 2, 3] }), 0)
    const { fee, fi } = await eventPromise(testEmitter, 'foo')
    expectTypeOf(fee).toEqualTypeOf<string>()
    expectTypeOf(fi).toEqualTypeOf<number[]>()
  })
})

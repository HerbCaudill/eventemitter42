# EventEmitter42

This is a Typescript/ESM port of [eventemitter3](https://github.com/primus/eventemitter3).

The motivation behind this is that I often use a pattern of awaiting for a promisified event, and
[neither me nor the internet](https://stackoverflow.com/questions/77814862/is-it-possible-to-strongly-type-the-return-value-of-this-function) could get strong typing on the result of that promise.

```ts
type TestEvents = {
  foo: (payload: { bar: string }) => void
}

const testEmitter = new EventEmitter<TestEvents>()

const { bar } = await eventPromise(testEmitter, 'foo')
// error: Property 'bar' does not exist on type 'unknown'.
```

As a bonus this library includes that `eventPromise` function.

```ts
const { bar } = await eventPromise(testEmitter, 'foo')
// ✅ bar is `string`
```

## Omitted features

I left out some eventemitter3 features that I've never used:

- Prefixed event names
- Passing context to a listener
- `eventNames`, `listeners` and `listenerCount` methods

Event types can only be expressed as a map of function signatures:

```ts
type TestEvents = {
  foo: (p: string) => void
  bar: (p: number) => void
  baz: (p: { a: boolean[]; b: boolean[] }) => void
}
```

## Installation

```bash
$ pnpm add eventemitter42
```

## Usage

```js
import { EventEmitter } from 'eventemitter42'

class MyEmitter extends EventEmitter<TestEvents> {
  doSomething() {
    this.emit('foo', 'here is a payload')
  }

  doSomethingElse() {
    this.emit('bar', 42)
  }
}

const emitter = new MyEmitter()

emitter.on('foo', p => {
  console.log(p) // 'here is a payload'
})

emitter.doSomething()

setTimeout(() => emitter.doSomethingElse(), 1000)

const result = await eventPromise(emitter, 'bar')
console.log(result) // '42' (after a second)
```

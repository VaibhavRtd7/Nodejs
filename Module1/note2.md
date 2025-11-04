
## Table of Contents

1. Introduction to Node.js
2. Node.js Overview
3. Node.js Frameworks and Tools
4. JavaScript Fundamentals
5. History of Node.js
6. JavaScript Syntax & Basics
7. JavaScript Language Basics (deep-dive)
8. Expressions, Types, Variables
9. Functions, `this`, Arrow Functions, Loops, Scopes, Arrays, Template Literals, Semicolons, Strict Mode
10. ECMAScript Versions — ES6, ES7, ES8 updates
11. Asynchronous JavaScript — Callbacks, Promises, Async/Await, Closures, Timers
12. The Event Loop — theory and practical Node.js examples
13. Event Loop in Node.js vs Browser JavaScript
14. Appendix: Tips, Debugging, Performance, Further Reading


---

# 11. Asynchronous JavaScript — Callbacks, Promises, Async/Await, Closures, Timers

## 11.1 Callbacks

Classic pattern: pass a function to run when asynchronous work completes.

```js
const fs = require('fs');
fs.readFile('./file.txt', 'utf8', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```

Problems: callback hell, inversion of control.

## 11.2 Promises

A Promise represents a future value or failure.

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('done'), 1000);
});

p.then(value => console.log(value)).catch(err => console.error(err));
```

**Chaining**

```js
doAsync()
  .then(result => doAnother(result))
  .then(final => console.log(final))
  .catch(err => console.error(err));
```

## 11.3 Async/Await

Syntactic sugar over Promises — write asynchronous code that reads like synchronous.

```js
async function run() {
  try {
    const data = await fs.promises.readFile('./file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
run();
```

## 11.4 Timers

`setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`.

```js
const id = setTimeout(() => console.log('later'), 1000);
clearTimeout(id);
```

## 11.5 Common pitfalls

* Not returning a Promise in `.then()` chain.
* Swallowing errors.
* Blocking CPU-bound work on the main thread — use `worker_threads` or external services for heavy CPU tasks.

---

# 12. The Event Loop — Theory and Practical Examples

The Event Loop is the mechanism that schedules callbacks, microtasks, and timers. Understanding it is key to mastering asynchronous JS.

**High-level phases (browser & Node differences later):**

1. Execute the current call stack (synchronous code).
2. Process microtasks (Promise callbacks, `process.nextTick` in Node).
3. Process macrotasks (timers, I/O callbacks)
4. Render (in browsers)

**Microtasks vs Macrotasks**

* Microtasks (aka job queue): `Promise.then`, `queueMicrotask` — they run *before* the next macrotask.
* Macrotasks: `setTimeout`, `setInterval`, I/O callbacks.

**Example to illustrate ordering**

```js
console.log('start');

setTimeout(() => console.log('timeout'), 0);

Promise.resolve().then(() => console.log('promise'));

console.log('end');

// Output order:
// start
// end
// promise
// timeout
```

Explanation: synchronous logs run first. Promise microtask runs after current stack but before timers.

## 12.1 Node-specific microtask: `process.nextTick`

`process.nextTick()` runs even before Promises microtasks in Node — it's a special queue.

```js
console.log('start');
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
console.log('end');

// Output:
// start
// end
// nextTick
// promise
```

---

# 13. Event Loop in Node.js vs Browser JavaScript

**Key differences**:

* Node uses libuv's event loop. The loop has phases: timers, pending callbacks, idle/prepare, poll (I/O), check (setImmediate), close callbacks. There are also microtask queues (`process.nextTick` and Promises).
* `setImmediate()` is Node-specific — scheduled for the **check** phase, typically runs after I/O callbacks and after the current poll phase.
* `process.nextTick()` runs *before* other microtasks and can starve the I/O loop if abused.

**Example: `setTimeout` vs `setImmediate` vs `process.nextTick`**

```js
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  process.nextTick(() => console.log('nextTick'));
});
```

Typical output (subject to timing and the Node version):

```text
nextTick
immediate
timeout
```

Because `process.nextTick()` runs first, then after poll phase `setImmediate` runs, and timers may run in the subsequent timer phase.

**Practical tip**: avoid using `process.nextTick` for 3rd-party code to prevent starving the event loop.

---

# 14. Practical Node.js Patterns & Examples

## 14.1 Building a simple HTTP server (core `http` module)

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node core HTTP!');
});

server.listen(3000, () => console.log('Listening on http://localhost:3000'));
```

## 14.2 Reading files asynchronously and synchronously

```js
const fs = require('fs');
// Async (non-blocking)
fs.readFile('./package.json', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('async file length', data.length);
});

// Sync (blocking) — avoid in server request handlers
const data = fs.readFileSync('./package.json', 'utf8');
console.log('sync file length', data.length);
```

## 14.3 Streams — handling large data efficiently

Streams allow processing chunks of data with low memory footprint.

```js
const fs = require('fs');
const read = fs.createReadStream('./large-file.txt', { encoding: 'utf8' });
read.on('data', chunk => {
  console.log('chunk length', chunk.length);
});
read.on('end', () => console.log('done'));
```

## 14.4 Child processes

Spawn external processes without blocking the main thread.

```js
const { spawn } = require('child_process');
const ls = spawn('ls', ['-la']);
ls.stdout.on('data', d => process.stdout.write(d));
ls.on('close', code => console.log('child exited', code));
```

## 14.5 Using `worker_threads` for CPU-bound work

For heavy CPU tasks, use worker threads to avoid blocking event loop.

```js
// main.js
const { Worker } = require('worker_threads');
const worker = new Worker('./worker.js');
worker.on('message', msg => console.log('worker said', msg));
worker.postMessage({ n: 42 });
```

```js
// worker.js
const { parentPort } = require('worker_threads');
parentPort.on('message', ({ n }) => {
  // heavy computation
  let sum = 0;
  for (let i = 0; i < 1e8; i++) sum += i;
  parentPort.postMessage({ sum });
});
```

---
# Introduction to Node.js — Beginner to Advanced (Complete Guide)

> **What this guide covers:** A complete, practical, and progressive walkthrough of Node.js and essential JavaScript concepts — from fundamentals to advanced topics like the Event Loop, asynchronous patterns, Node.js APIs, and advanced frameworks. Each section includes detailed explanations, runnable code snippets, and real-world examples.

---

## Table of Contents

14. Node.js Core Modules (Detailed)
15. File System (fs)
16. HTTP Module
17. Streams
18. Events and EventEmitter
19. Buffer and Binary Data
20. Modules and require()
21. Error Handling in Node.js
22. Debugging and Profiling
23. Advanced Topics (Clusters, Child Processes, Worker Threads)
24. Security in Node.js
25. Performance Optimization
26. Real-World Application: REST API with Express
27. Real-World Application: File Uploader with Streams
28. Practical Exercises & Challenges
29. Further Reading & Next Steps

---

# 14. Node.js Core Modules (Detailed)

Node.js includes a set of core modules that you can use without installing external packages.

| Module   | Description                                   |
| -------- | --------------------------------------------- |
| `fs`     | File system operations (read/write files)     |
| `path`   | Work with file and directory paths            |
| `os`     | Access operating system-level info            |
| `http`   | Create HTTP servers and clients               |
| `events` | Implement event-driven programming            |
| `util`   | Utility functions (inherits, promisify, etc.) |
| `crypto` | Cryptography and hashing                      |
| `stream` | Work with data streams                        |
| `buffer` | Handle binary data                            |

**Example: Using `os` and `path`**

```js
const os = require('os');
const path = require('path');

console.log('Platform:', os.platform());
console.log('CPU Cores:', os.cpus().length);

const fullPath = path.join(__dirname, 'test', 'file.txt');
console.log('Full Path:', fullPath);
```

---

# 15. File System (fs)

The `fs` module allows working with the file system in both synchronous and asynchronous ways.

**Reading and Writing Files**

```js
const fs = require('fs');

// Async Read
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log('File data:', data);
});

// Async Write
fs.writeFile('output.txt', 'Hello Node!', err => {
  if (err) throw err;
  console.log('File written!');
});
```

**Using Promises with fs.promises**

```js
const fs = require('fs').promises;

async function readFileAsync() {
  try {
    const data = await fs.readFile('example.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

readFileAsync();
```

---

# 16. HTTP Module

The `http` module enables you to create servers and make HTTP requests.

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node HTTP!');
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
```

**Making a GET request**

```js
const http = require('http');

http.get('http://example.com', res => {
  let data = '';
  res.on('data', chunk => (data += chunk));
  res.on('end', () => console.log(data));
});
```

---

# 17. Streams

Streams allow working with large data efficiently. There are four types:

* **Readable** (e.g., fs.createReadStream)
* **Writable** (e.g., fs.createWriteStream)
* **Duplex** (both readable and writable)
* **Transform** (data is modified during streaming)

**Example: Copy a file using streams**

```js
const fs = require('fs');
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream);
```

---

# 18. Events and EventEmitter

The `events` module enables the event-driven pattern — essential for Node internals.

```js
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}

const emitter = new MyEmitter();
emitter.on('greet', name => console.log(`Hello ${name}!`));
emitter.emit('greet', 'Node.js');
```

---

# 19. Buffer and Binary Data

Buffers handle raw binary data — common when dealing with files, streams, or network packets.

```js
const buf = Buffer.from('Hello');
console.log(buf); // Hex representation
console.log(buf.toString()); // Converts back to string
```

---

# 20. Modules and require()

Node.js uses CommonJS for modular programming.

**math.js**

```js
exports.add = (a, b) => a + b;
exports.sub = (a, b) => a - b;
```

**main.js**

```js
const math = require('./math');
console.log(math.add(5, 3));
```

---

# 21. Error Handling in Node.js

Handle errors gracefully to avoid crashes.

```js
try {
  throw new Error('Something went wrong');
} catch (err) {
  console.error('Caught error:', err.message);
}
```

**EventEmitter errors**

```js
const EventEmitter = require('events');
const e = new EventEmitter();
e.on('error', err => console.error('Error event:', err.message));
e.emit('error', new Error('Oops'));
```

---

# 22. Debugging and Profiling

**Debugging tools**

* `node inspect file.js`
* `node --inspect-brk file.js` (connects with Chrome DevTools)
* `console.log`, `console.table`, `console.time`

**Profiling**
Use built-in Node profiler:

```bash
node --prof app.js
```

---

# 23. Advanced Topics

**Clusters** — utilize multiple CPU cores.

```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) cluster.fork();
} else {
  http.createServer((req, res) => {
    res.end(`Handled by worker ${process.pid}`);
  }).listen(8000);
}
```

**Worker Threads** — for CPU-heavy operations.
(See earlier worker examples.)

---

# 24. Security in Node.js

1. **Validate input** — prevent injection.
2. **Use Helmet** in Express to set secure HTTP headers.
3. **Avoid eval()**, Function constructors.
4. **Keep dependencies updated** using `npm audit fix`.
5. **Use HTTPS** for secure communication.

---

# 25. Performance Optimization

* Use clustering or load balancing.
* Use caching (Redis, memory-cache).
* Use async/await and streams.
* Profile performance with `clinic.js` or `node --prof`.
* Avoid synchronous file I/O in production.

---

# 26. Real-World Application: REST API with Express

```js
const express = require('express');
const app = express();
app.use(express.json());

const users = [];

app.get('/users', (req, res) => res.json(users));
app.post('/users', (req, res) => {
  users.push(req.body);
  res.status(201).json({ message: 'User added' });
});

app.listen(4000, () => console.log('API running on http://localhost:4000'));
```

---

# 27. Real-World Application: File Uploader with Streams

```js
const express = require('express');
const fs = require('fs');
const app = express();

app.post('/upload', (req, res) => {
  const fileStream = fs.createWriteStream('uploaded.txt');
  req.pipe(fileStream);
  req.on('end', () => res.send('Upload complete'));
});

app.listen(5000, () => console.log('Uploader running on port 5000'));
```

---

# 28. Practical Exercises & Challenges

1. Build a command-line weather app using Node and a public API.
2. Create a static file server using only the `http` module.
3. Convert callback-based code to Promise-based.
4. Use `worker_threads` to calculate factorial of large numbers.
5. Implement an event-driven task queue.

---

# 29. Further Reading & Next Steps

* [Node.js Official Docs](https://nodejs.org/en/docs)
* [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* *You Don’t Know JS* by Kyle Simpson
* [Node.js Design Patterns](https://www.nodejsdesignpatterns.com/)
* Experiment with TypeScript and NestJS for large projects.

---

# ✅ Conclusion

You’ve now covered **Node.js from beginner to advanced**, including JavaScript fundamentals, asynchronous patterns, the Event Loop, and Node core APIs. You’re ready to build efficient, scalable, and maintainable Node applications.

> Next steps: Build real projects — REST APIs, chat servers, file processors — and explore databases (MongoDB, PostgreSQL) to strengthen your Node.js expertise.

---

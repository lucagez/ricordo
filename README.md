<p align="center">
  <img src="ricordo.svg" height="200px" alt="ricordo logo" />
  <br>
  <a href="https://travis-ci.org/lucagez/ricordo"><img src="https://travis-ci.com/lucagez/ricordo.svg?branch=master" alt="travis"></a>
  <a href="https://www.npmjs.org/package/ricordo"><img src="https://img.shields.io/npm/v/ricordo.svg?style=flat" alt="npm"></a>
  <img src="https://img.shields.io/badge/license-MIT-f1c40f.svg" alt="MIT">
  <a href="https://unpkg.com/ricordo"><img src="https://img.badgesize.io/https://unpkg.com/ricordo@0.0.1/dist/ricordo.js?compression=gzip" alt="gzip size"></a>
</p>

# RICORDO

> Micro caching / memo library with ttl support.

## Installation

If using npm:
```bash
npm install ricordo
```

If not:
```html
<script src="https://unpkg.com/ricordo@0.0.1/dist/ricordo.umd.js"></script>
```

## Usage

`Ricordo` usage is pretty straightforward:
  1. Create a new `Ricordo` instance passing a function to cache and some optional arguments.
  2. Use the function.

#### Caching a function

```javascript
const Ricordo = require('ricordo'); // Node.js

const demoFunc = a => `hello ${a}`;

// Cache function
const cached = new Ricordo(demoFunc);

// Use function
cached('world'); // No cache hit.
cached('world'); // cache hit.

```

#### Expesive functions

```javascript
const Ricordo = require('ricordo'); // Node.js

const fibonacci = n => (n < 2) ? n : fibonacci(n - 1) + fibonacci(n - 2);

// Cache function
const cached = new Ricordo(fibonacci);

// First execution
cached(40); // 1200ms

// Cached execution
cached(40); // 0ms
cached(40); // 0ms
cached(40); // 0ms

```

#### Using TTL (time-to-live)

`Ricordo` supports a time-to-live prop on a newly created instance.
`ttl` define (in ms) the lifespan of the cached key.
The key will be removed from cache after `ttl` if there are no hits to that key.

NOTE: `ttl` must be above 1000ms.

```javascript
const Ricordo = require('ricordo'); // Node.js

// Cache function
const cached = new Ricordo(a => `hello ${a}`, {
  ttl: 5000 * 1000, // lifespan of key.
});

// ####### 1 #######
// First execution
cached('world'); // no cache hit => insertion.

// Executing function after ttl
setTimeout(() => cached('world'), 5000 * 1001); // No cache hit => New insertion

// ####### 2 #######
// First execution
cached('world'); // no cache hit => insertion.
cached('world'); // cache hit => ttl will be renewed.

// Executing function after ttl
setTimeout(() => cached('world'), 5000 * 1001); // cache hit!!! 🎉

```

## Contributing

Every PR is welcomed 🎉 
If you have ideas on how to improve upon this library don't hesitate to email me at `lucagesmundo@yahoo.it`.


## License

MIT.
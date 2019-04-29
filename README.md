<p align="center">
  <img src="ricordo.svg" height="200px" alt="ricordo logo" />
  <br>
  <a href="https://travis-ci.org/lucagez/ricordo"><img src="https://travis-ci.com/lucagez/ricordo.svg?branch=master" alt="travis"></a>
  <a href="https://www.npmjs.org/package/ricordo"><img src="https://img.shields.io/npm/v/ricordo.svg?style=flat" alt="npm"></a>
  <img src="https://img.shields.io/badge/license-MIT-f1c40f.svg" alt="MIT">
  <a href="https://unpkg.com/ricordo"><img src="https://img.badgesize.io/https://unpkg.com/ricordo/dist/ricordo.js?compression=gzip" alt="gzip size"></a>
</p>

# RICORDO

> Micro caching / memo library with ttl support.

When you need some caching, and setting up Redis is too much.
`Ricordo` is a **700** bytes library that fully supports Node.js and the browser.
With `time-to-live` support and full control on the number of cached keys.

## Table of Contents

  - [Installation](#installation)
  - [Usage](#usage)
      - [Caching a function](#caching-a-function)
      - [Expesive functions](#expesive-functions)
      - [Using TTL (time-to-live)](#using-ttl-time-to-live)
      - [Setting limits on number of cached keys](#setting-limits-on-number-of-cached-keys)
      - [Destroy cache](#destroy-cache)
      - [Force deletion](#force-deletion)
      - [Caching React component](#caching-react-component)
  - [API](#api)
      - [Ricordo](#ricordo)
      - [Config](#config)
      - [Destroy](#destroy)
  - [License](#license)


## Installation

If using npm:
```bash
npm install ricordo
```

If not:
```html
<script src="https://unpkg.com/ricordo/dist/ricordo.umd.js"></script>
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

#### Setting limits on number of cached keys

You can set a limit on the number of keys that can be cached.
When `limit` n of inserted keys is hit, the cache will return to `ideal` n of
items.
The keys that are kept when `limit` is hit are the `ideal` n of items most accessed 
in the `ttl` iterval.

NOTE: A range is used so the operations of sorting and deleting the useless keys will be less frequent.

```javascript
const Ricordo = require('ricordo'); // Node.js

// Cache function
const cached = new Ricordo(a => `hello ${a}`, {
  ttl: 5000 * 1000, // lifespan of key.
  ideal: 2, // Ideal number of cached keys
  limit: 4, // Max number of cached keys
});

cached('A'); // No cache
cached('B'); // No cache
cached('C'); // No cache

// Accessing keys A, B for 5 times.
[1, 2, 3, 4, 5].forEach(e => {
  cached('A'); // From cache
  cached('B'); // From cache
});

// Accessing C key for 2 times.
[1, 2].forEach(e => {
  cached('C'); // From cache
});

// On the next insertion the `limit` (4) is hit
// => Only the `ideal` (2) items that are most accessed will be kept. => (A, B)
cached('D') // New insertion

// Then...
cached('A') // From cache
cached('B') // From cache
cached('C') // No cache

```

#### Destroy cache

Every ricordo instance has a `destroy` method.
This method will clear every cached key.

```javascript
const Ricordo = require('ricordo'); // Node.js

// Cache function
const cached = new Ricordo(a => `hello ${a}`);

cached('A'); // No cache
cached('B'); // No cache

cached('A'); // From cache
cached('B'); // From cache

// Destroy every cached key.
cache.destroy();

cached('A'); // No cache
cached('B'); // No cache

```

#### Force deletion

If `force` flag is enabled, cached keys will be deleted after `ttl`.
Also if there are multiple hits to that key.

```javascript
const Ricordo = require('ricordo'); // Node.js

// Specifying force flag.
const cached = new Ricordo(a => `hello ${a}`, { ttl: 1000, force: true });

cached('A'); // No cache
cached('A'); // From cache
cached('A'); // From cache

setTimeout(() => cached('A'), 1001) // No cache => lifespan not renewed.

```

#### Caching React component

```jsx
import React, { Component } from 'react';
import Ricordo from 'ricordo';

const C = a => <h1>hello {a}</h1>;

const cached = new Ricordo(C);

class App extends Component {

  // Invoking cached function => now 'world' is a registered key
  // The next time that the function will be computed with 'world' as argument,
  // the previously created component will be returned.
  render = () => <div>{cached('world')}</div>;
}

```

## API

#### Ricordo

| param  | type     | required | default   | spec                    |
| ------ | -------- | -------- | --------- | ----------------------- |
| func   | function | yes      |           | Function to cache.      |
| config | object   | no       | undefined | Defines cache behavior. |

#### Config

| param | type            | required                           | default   | spec                                                |
| ----- | --------------- | ---------------------------------- | --------- | --------------------------------------------------- |
| ttl   | number [> 1000] | no                                | undefined | Lifespan of cached key                              |
| ideal | number          | no [yes, if `limit` is specified] | undefined | Ideal number of cached keys                         |
| limit | number          | no [yes, if `ideal` is specified] | undefined | Max number of cached keys                           |
| force | boolean         | no                                 | false     | If set to true, cache will not be renewed after ttl |


#### Destroy


| param | type    | required                           | default   | spec                                                                         |
|-------|---------|------------------------------------|-----------|------------------------------------------------------------------------------|
| key   | any     | no                                 | undefined | key to delete from cache. If no key is specified, every key will be deleted. |

## License

MIT.
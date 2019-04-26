
// This func exposes the newly created `Ricordo` instance.
// Interacting with the inner class method (private).
function run(...args) {
  // Avoiding stringification of simple arguments as js store support any type.
  // By simple I mean every type comparable "simply" by strict equality comparison `===`.
  // => Comparing arrais and objects is simpler/cleaner by stringifying them
  // and comparing the resulting strings.

  // NOTE-1: this is not tested with objects with a complex structure.

  // NOTE-2: this func will throw error if a circular structure is provided.
  // Support for those structures is out of the scope of this library
  // => Keeping it small and usable also on the browser.

  const key = (() => {
    if (args.length <= 1) return typeof args[0] === 'object' ? JSON.stringify(args[0]) : args[0];
    return JSON.stringify(args);
  })();

  if (this.store.has(key)) return this.store.get(key);

  const result = this.func(...args);
  this.store.set(key, result);
  return result;
}

// For stats => just override Map (extends) native implementation
// Actually add `has`.
// class MyMap extends Map {
//   set(...args) {
//     console.log("set called");
//     return super.set(...args);
//   }
//   get(...args) {
//     console.log("get called");
//     return super.get(...args);
//   }
// }

/**
 * Config [object]:
 * - mode [string]
 * => allowed values ['last-used', 'most-used', 'random', 'boom', 'memory-usage-UNSAFE']
 * - ideal [number] => ideal number of items to keep cached.
 * - limit [number] => n of items that triggers store behavior.
 */

const _behavior = (mode) => {
  switch (mode) {
    case 'last-used':
      return {
        storage: [],
        middleware: function handle(key) {
          this.storage.push(key);
          if (this.storage.length > this.ideal) this.storage.shift();
        },
        onLimit: function handle() {
          const newStats = Array.from(new Set(this.storage)).map(e => [e, this.map.get(e)]);
          // err => removing more items than necessary.
          this.map = new Map(newStats);
        },
      };
    case 'most-used':
      return {
        storage: new Map(),
        middleware: function handle(key) {
          const n = this.storage.get(key) || 0;
          this.storage.set(key, n + 1);
        },
        onLimit: function handle() {
          const arr = Array.from(this.storage).sort((a, b) => b[1] - a[1]);
          arr.length = this.ideal;

          const newStats = arr.map(e => [e[0], this.map.get(e[0])]);
          this.map = new Map(newStats);
        },
      };
    default:
      return 0;
  }
};

// Wrapping a native Map instance to trap queries to store and collect caching info.
class _Trap {
  constructor({ storage, middleware, onLimit }, ideal, limit) {
    this.storage = storage;
    this.ideal = ideal;
    this.limit = limit;

    this.onLimit = onLimit.bind(this);
    this.middleware = middleware.bind(this);
    this.map = new Map();
  }

  has(key) {
    return this.map.has(key);
  }

  get(key) {
    this.middleware(key);
    return this.map.get(key);
  }

  set(key, value) {
    if (this.map.size > this.limit) this.onLimit();
    return this.map.set(key, value);
  }
}

export default class Ricordo {
  // CONFIG SI VEDRA` (:
  constructor(func, config = {}) {
    if (typeof func !== 'function') throw new TypeError('func argument must be of type `function`');

    // Key value store used for caching `arguments => results`
    this.store = config ? new _Trap(_behavior(config.mode), config.ideal, config.limit) : new Map();
    this.func = func;

    return run.bind(this);
  }
}

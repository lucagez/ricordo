
// This func exposes the newly created `Ricordo` instance.
// Interacting with the inner class method (private).
function run(...args) {
  // Avoiding stringification of simple arguments as js store support any type.
  // By simple I mean every type comparable `simply` with the strict equality operator `===`.
  // => Comparing simple arrais and objects is simpler by stringifying them
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

class _Trap {
  constructor() {
    this.map = new Map();
  }

  has(...args) {
    return this.map.has(...args);
  }

  get(...args) {
    return this.map.get(...args);
  }

  set(...args) {
    return this.map.set(...args);
  }
}

export default class Ricordo {
  // CONFIG SI VEDRA` (:
  constructor(func, config) {
    if (typeof func !== 'function') throw new TypeError('func argument must be of type `function`');

    // Key value store used for caching `arguments => results`
    this.store = config ? new _Trap(config) : new Map();
    this.func = func;

    return run.bind(this);
  }
}

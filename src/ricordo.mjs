import _Trap from './_trap';

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

  if (this.cache.has(key)) return this.cache.get(key);

  const result = this.func(...args);
  this.cache.set(key, result);
  return result;
}


function _destroy() {
  // Destroy previous cache instance and re-initializing to empty tate according to
  // provided config object.
  this.cache = this.init(this.config);
}

const _init = config => config ? new _Trap(config) : new Map();

export default class Ricordo {
  constructor(func, config) {
    if (typeof func !== 'function') throw new TypeError('func argument must be of type `function`');

    // Used in `run`
    this.func = func;

    // Useful for `destroy` method.
    this.init = _init;
    this.config = config;

    // Key value store used for caching `arguments => results`
    this.cache = _init(config);

    const expose = run.bind(this);
    expose.destroy = _destroy.bind(this);

    return expose;
  }
}

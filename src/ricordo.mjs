import _Trap from './_trap';

// This func exposes the newly created `Ricordo` instance.
// Interacting with the inner class method (private).
function run() {
  // Avoiding stringification of simple arguments as Map store supports any type.
  // By simple I mean every type comparable `simply` with the strict equality operator `===`.
  // => Comparing simple arrais and objects is simpler / cleaner by stringifying them
  // and comparing the resulting strings.

  // NOTE-1: this is not tested with objects with a complex structure.

  // NOTE-2: this func will throw error if a circular structure is provided.
  // Support for those structures is out of the scope of this library
  // => Keeping it small and usable also on the browser.
  const key = this.makeKey(...arguments);

  if (this.cache.has(key)) return this.cache.get(key);

  const result = this.func(...arguments);
  this.cache.set(key, result);
  return result;
}


export default class Ricordo {
  constructor(func, config) {
    if (typeof func !== 'function') throw new TypeError('`func` argument must be of type function');

    // Used in `run`
    this.func = func;

    // Key value store used for caching `arguments => results`
    this.cache = config ? new _Trap(config) : new Map();

    const expose = run.bind(this);
    expose.destroy = (key) => {
      // Destroy previous cache instance and re-initializing to empty tate according to
      // provided config object.
      if (key) this.cache.delete(this.makeKey(key));
      else this.cache.clear();
    };

    return expose;
  }

  makeKey() {
    const first = arguments[0];
    if (arguments.length <= 1) return typeof first === 'object' ? JSON.stringify(first) : first;
    return JSON.stringify(arguments);
  }
}

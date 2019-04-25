// This func exposes the newly created `Ricordo` instance.
// Interacting with the inner class method (private).
function run(...args) {
  // Avoiding stringification of simple arguments as js Map support any type.
  // By simple I mean every type comparable `simply` with the strict equality operator `===`.
  // => Comparing simple arrais and objects is simpler by stringifying them
  // and comparing the resulting strings.

  // NOTE-1: this is not tested with complex structure.

  // NOTE-2: this func will throw error if a circular structure is provided.
  // Support for those structures is out of the scope of this library
  // => Keeping it small and usable also on the browser.

  const key = (() => {
    if (args.length <= 1) return typeof args[0] === 'object' ? JSON.stringify(args[0]) : args[0];
    return JSON.stringify(args);
  })();

  if (this.map.has(key)) return this.map.get(key);

  const result = this.func(...args);
  this.map.set(key, result);
  return result;
}

export default class Ricordo {
  // CONFIG SI VEDRA` (:
  constructor(func) {
    if (typeof func !== 'function') throw new TypeError('func argument must be of type `function`');

    this.map = new Map();
    this.func = func;

    return run.bind(this);
  }
}

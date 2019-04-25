
function run(...args) {
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
  constructor(func, config) {
    // CONFIG SI VEDRA` (:
    if (typeof func !== 'function') throw new TypeError('func argument must be of type `function`');

    this.map = new Map();
    this.func = func;

    return run.bind(this);
  }
};
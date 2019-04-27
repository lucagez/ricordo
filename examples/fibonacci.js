const Ricordo = require('../dist/ricordo');

const bench = (func, args) => {
  const t0 = Date.now();
  func(...args);
  return Date.now() - t0;
};

// Useless one-liner that kills your eyes
const fibonacci = n => (n < 2) ? n : fibonacci(n - 1) + fibonacci(n - 2);
const cached = new Ricordo(fibonacci);

const n = 40;

const no_cache_1 = bench(fibonacci, [n]); // 1100ms
const cache_1 = bench(cached, [n]); // 1200ms

// On second execution the cache will be hit for n.
const no_cache_2 = bench(fibonacci, [n]); // 1100ms
const cache_2 = bench(cached, [n]); // 0ms



console.log(`cache_1: ${cache_1}ms`);
console.log(`no_cache_1: ${no_cache_1}ms`);
console.log(`cache_2: ${cache_2}ms`);
console.log(`no_cache_2: ${no_cache_2}ms`);

const Ricordo = require('../dist/ricordo');

const router = (url) => {
  const params = [];
  if (url === '/') {
    return {
      path: url,
      params,
    };
  }

  // Cleaning url string
  const use = url.replace(/\/$|\?(.*)/, '');

  // Capturing params and transform input string in a standardized one.
  const path = use.replace(/(?<=\/)\d+/g, (param) => {
    params.push(param);
    return ':par';
  });

  return { path, params };
};

// Caching router func.
const cached = new Ricordo(router);

const n = 10000000;

// ⬇⬇⬇ Measuring execution time on the same task ⬇⬇⬇

const t0 = Date.now();
for (let i = 0; i < n; i++) {
  cached('/users/897');
}
const t_cache = Date.now() - t0;

const t1 = Date.now();
for (let j = 0; j < n; j++) {
  router('/users/897');
}
const t_no_cache = Date.now() - t1;

const percentage_change = (t_no_cache - t_cache) / t_cache * 100;

console.log('t_no_cache:', t_no_cache);
console.log('t_cache:', t_cache);
console.log(`percentage_change: ${percentage_change.toFixed(0)}%`);
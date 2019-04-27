// Scratch-pad

const Ricordo = require('../dist/ricordo');

const bench = (func, args) => {
  const t0 = Date.now();
  func(...args);
  return Date.now() - t0;
};
// const cached = new Ricordo(a => a + 1, { ttl: 1000, limit: 30, ideal: 10 });
const path = url => url.replace(/(?<=\/)\d+/g, (param) => ':par');

const _find = url => {
  const params = [];
  if (url === '/') {
    return {
      path: url,
      params,
    };
  }

  const use = url.replace(/\/$|\?(.*)/, '');
  const path = use.replace(/(?<=\/)\d+/g, (param) => {
    params.push(param);
    return ':par';
  });

  return { path, params };
}

const cached = new Ricordo(_find);

const t0 = Date.now();
for (let i = 0; i < 10000000; i++) {
  cached('/users/897');
}
console.log(Date.now() - t0);

const t1 = Date.now();
for (let i = 0; i < 10000000; i++) {
  path('/users/897');
}
console.log(Date.now() - t1);


// let i = 0;
// setInterval(() => {
//   i += 1;
//   // console.log(cached(2 + i));
//   // console.log(cached(2 + i));
//   // console.log(cached(2 + i));
//   console.log(cached('peppino'));
//   // console.log(cached('peppino'))
// }, 200);

// setTimeout(() => {
//   cached.destroy();
// }, 2000);

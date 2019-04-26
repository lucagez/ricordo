// Scratch-pad

const Ricordo = require('../dist/ricordo');

const cached = new Ricordo(a => a + 1, { ttl: 1000, limit: 30, ideal: 10 });

// console.log(cached(2));

let i = 0;
setInterval(() => {
  i += 1;
  // console.log(cached(2 + i));
  // console.log(cached(2 + i));
  // console.log(cached(2 + i));
  console.log(cached('peppino'));
  // console.log(cached('peppino'))
}, 200);

setTimeout(() => {
  cached.destroy();
}, 2000);

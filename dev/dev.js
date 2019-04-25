// Scratch-pad

const Ricordo = require('../dist/ricordo');

const cached = new Ricordo(a => a + 1, { freq: 2000 });

console.log(cached(2));

setInterval(() => {
  console.log(cached(2));
}, 100);


const _memUsage = map => JSON.stringify([...map]).length;

let m = new Map();

m.set('a', 1);
m.set('b', { a: 1, b: 2, c: 3 });
m.set('c', [1, 2, 3, 4, 5, 6]);

console.log('before', process.memoryUsage().heapUsed / 1024 / 1024);
for (let index = 0; index < 100000; index++) {
  m.set(index, { a: 1, b: 2, c: 3 });
}
console.log('after', process.memoryUsage().heapUsed / 1024 / 1024);
const n = [
  2, 2, { a: 1 }, 2, 2
];

console.log(_memUsage(m));
console.log('after calc', process.memoryUsage().heapUsed / 1024 / 1024);

// m.clear();
m = null;
console.log(m);
console.log('after clear', process.memoryUsage().heapUsed / 1024 / 1024);
// console.log(Buffer.from(n));
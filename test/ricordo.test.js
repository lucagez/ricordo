const { expect } = require('chai');
const Ricordo = require('../dist/ricordo');

// async sleep
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Bench function
const bench = async (func, args) => {
  const t0 = Date.now();
  await func(...args);
  return Date.now() - t0;
};

describe('Core Ricordo tests', () => {
  it('Should throw if a new Ricordo instance is created without args', () => {
    const createInstance = () => new Ricordo();
    expect(createInstance).to.throw();
  });

  it('Should throw if a new Ricordo instance is created with no function first arg', () => {
    const createInstance = () => new Ricordo(42);
    expect(createInstance).to.throw();
  });

  it('Should NOT throw if a new Ricordo instance is created with function first arg', () => {
    const createInstance = () => new Ricordo(() => 42);
    expect(createInstance).to.not.throw();
  });

  it('Should execute a function normally, no matter what', () => {
    const cached = new Ricordo(test => test * 2);
    const a = cached(2); // 4
    const b = cached(2); // 4

    expect(a).to.be.a('number');
    expect(b).to.be.a('number');
    expect(a).to.equal(b);
  });

  it('Should NOT hit cache if different single-arguments are provided', async () => {
    // Introducing a long sleep in function to immediately see if invoking the cached
    // function hits its own cache.
    const func = async (arg) => {
      await sleep(200);
      return arg * 2;
    };

    const cached = new Ricordo(func);

    // Benchmarking execution time for functions
    const a = await bench(cached, [2]);
    const b = await bench(cached, [4]);

    // If the percentage error calculated with the execution time of the same cached
    // function provided two different values is quite small, we are sure that no cache is hit.
    // As we introduced a long delay in the function invocation.
    const percentageError = (a - b) / a * 100;
    expect(percentageError).to.be.below(2);
  });

  it('Should hit cache if the same single-arguments are provided', async () => {
    const func = async (arg) => {
      await sleep(200);
      return arg * 2;
    };

    const cached = new Ricordo(func);

    // Benchmarking execution time for functions
    const a = await bench(cached, [2]);
    const b = await bench(cached, [2]); // Now the function is way faster.

    // If the percentage error calculated with the execution time of the same cached
    // function provided two different values is BIG, we are sure that the cache is hit.
    // As we introduced a long delay in the function invocation.
    const percentageError = (a - b) / a * 100;
    expect(percentageError).to.be.above(99);
  });

  it('Should NOT hit cache if different single (object) arguments are provided', async () => {
    const func = async (arg) => {
      await sleep(200);
      return arg.n * 2;
    };

    const cached = new Ricordo(func);

    // Benchmarking execution time for functions
    const a = await bench(cached, [{ n: 1 }]);
    const b = await bench(cached, [{ n: 2 }]);

    const percentageError = (a - b) / a * 100;
    expect(percentageError).to.be.below(2);
  });

  it('Should hit cache if the same single (object) argument is provided', async () => {
    const func = async (arg) => {
      await sleep(200);
      return arg.n * 2;
    };

    const cached = new Ricordo(func);

    // Benchmarking execution time for functions
    const a = await bench(cached, [{ n: 1 }]);
    const b = await bench(cached, [{ n: 1 }]);

    const percentageError = (a - b) / a * 100;
    expect(percentageError).to.be.above(99);
  });

  it('Should NOT hit cache if different multiple arguments are provided', async () => {
    const func = async (arg) => {
      await sleep(200);
      return arg.n * 2;
    };

    const cached = new Ricordo(func);

    // Benchmarking execution time for functions
    const a = await bench(cached, [23, 'abc', { n: 1 }]);
    const b = await bench(cached, [42, 'abcde', { n: 5 }]);

    const percentageError = (a - b) / a * 100;
    expect(percentageError).to.be.below(2);
  });

  it('Should hit cache if the same multiple arguments provided', async () => {
    const func = async (arg) => {
      await sleep(200);
      return arg.n * 2;
    };

    const cached = new Ricordo(func);

    // Benchmarking execution time for functions
    const a = await bench(cached, [23, 'abc', { n: 1 }]);
    const b = await bench(cached, [23, 'abc', { n: 1 }]);

    const percentageError = (a - b) / a * 100;
    expect(percentageError).to.be.above(99);
  });

  it('Should be faster retrieve from cache than recalc', async () => {
    const func = async (arg) => {
      await sleep(200);
      return arg.n * 2;
    };

    const cached = new Ricordo(func);

    // Benchmarking execution time for functions
    const a = await bench(cached, [{ n: 1 }]);
    const b = await bench(cached, [{ n: 1 }]);

    // Comparing execution time for non-cached (first time)
    // and cached (second time).
    expect(a).to.be.above(199);
    expect(b).to.be.below(2);
  });

  it('Should return the expected value given one (simple) argument', () => {
    const cached = new Ricordo(a => a + 1);

    const res = cached(2);
    const resCached = cached(2);

    expect(res).to.be.equal(3);
    expect(resCached).to.be.equal(3);
  });

  it('Should return the expected value given two (simple) arguments', () => {
    const cached = new Ricordo((a, b) => a + b);

    const res = cached(2, 3);
    const resCached = cached(2, 3);

    expect(res).to.be.equal(5);
    expect(resCached).to.be.equal(5);
  });

  it('Should return the expected value given one (object) argument', () => {
    const cached = new Ricordo(a => a.n + 1);

    const res = cached({ n: 1 });
    const resCached = cached({ n: 1 });

    expect(res).to.be.equal(2);
    expect(resCached).to.be.equal(2);
  });

  it('Should return the expected value given two (object) arguments', () => {
    const cached = new Ricordo((a, b) => a.n + b.n);

    const res = cached({ n: 1 }, { n: 2 });
    const resCached = cached({ n: 1 }, { n: 2 });

    expect(res).to.be.equal(3);
    expect(resCached).to.be.equal(3);
  });
});

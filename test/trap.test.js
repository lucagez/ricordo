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

describe('Trap tests', () => {
  it('Should instantiate new Trap instead of Map if config are provided', () => {
    const cached = new Ricordo(a => a + 1, { ttl: 1000 });

    // _Trap adds an additional method to the returned function.
    expect(cached.hasOwnProperty('destroy')).to.be.equal(true);
  });

  it('Should destroy cached key after ttl if key is not being accessed', async () => {
    const func = async (arg) => {
      await sleep(200);
      return arg.n * 2;
    };
    const cached = new Ricordo(func, { ttl: 1000 });
    const a = await bench(cached, [{ n: 1 }]); // > 200ms

    await sleep(1000);

    const b = await bench(cached, [{ n: 1 }]); // > 200ms

    expect(a).to.be.a('number').above(198);
    expect(b).to.be.a('number').above(198);
  });

  it('Should renew cache lifespan if key is accessed', async () => {
    const func = async (arg) => {
      await sleep(200);
      return arg.n * 2;
    };
    const cached = new Ricordo(func, { ttl: 1000 });
    const a = await bench(cached, [{ n: 1 }]); // 200ms
    const b = await bench(cached, [{ n: 1 }]); // 0ms

    await sleep(2000);

    const c = await bench(cached, [{ n: 1 }]); // 200ms

    expect(a).to.be.a('number').above(198);
    expect(b).to.be.a('number').below(5);
    expect(c).to.be.a('number').above(198);
  });

  it('Should keep `ideal` n of cached keys if `limit` is hit', async () => {
    const func = async (arg) => {
      await sleep(200);
      return arg.n * 2;
    };
    const cached = new Ricordo(func, { ttl: 5000, ideal: 2, limit: 4 });
    const a = await bench(cached, [{ n: 1 }]); // 200ms
    cached({ n: 1 });
    const b = await bench(cached, [{ n: 2 }]); // 200ms
    cached({ n: 2 });
    const c = await bench(cached, [{ n: 3 }]); // 200ms
    const d = await bench(cached, [{ n: 4 }]); // 200ms

    await sleep(500);

    const e = await bench(cached, [{ n: 1 }]); // 0ms
    const f = await bench(cached, [{ n: 2 }]); // 0ms
    const g = await bench(cached, [{ n: 3 }]); // 200ms
    const h = await bench(cached, [{ n: 4 }]); // 200ms

    expect(a).to.be.a('number').above(198);
    expect(b).to.be.a('number').above(198);
    expect(c).to.be.a('number').above(198);
    expect(d).to.be.a('number').above(198);

    expect(e).to.be.a('number').below(5);
    expect(f).to.be.a('number').below(5);
    expect(g).to.be.a('number').above(198);
    expect(h).to.be.a('number').above(198);
  });

  it('Should throw if ttl is smaller than 1000', () => {
    const smaller = () => new Ricordo(a => a + 1, { ttl: 100 });

    expect(smaller).to.throw();
  });

  it('Should throw if limit is provided without ideal prop', () => {
    const cached = () => new Ricordo(a => a + 1, { ttl: 1000, limit: 30 });

    expect(cached).to.throw();
  });

  it('Should remove key after timeout if force flag is true', async () => {
    const func = async (arg) => {
      await sleep(200);
      return arg.n * 2;
    };
    const cached = new Ricordo(func, { ttl: 1000, force: true });
    const a = await bench(cached, [{ n: 1 }]); // 200ms

    await sleep(200);

    // No insertion
    const b = await bench(cached, [{ n: 1 }]); // 0ms

    await sleep(1100);

    const c = await bench(cached, [{ n: 1 }]); // 200ms

    expect(a).to.be.a('number').above(198);
    expect(b).to.be.a('number').below(5);
    expect(c).to.be.a('number').above(198);
  });

  it('Should destroy every cached key when `destroy` method is called', async () => {
    const func = async (arg) => {
      await sleep(200);
      return arg.n * 2;
    };
    const cached = new Ricordo(func, { ttl: 1000 });

    const a = await bench(cached, [{ n: 1 }]); // 200ms
    const b = await bench(cached, [{ n: 2 }]); // 200ms

    cached.destroy();

    const c = await bench(cached, [{ n: 1 }]); // 200ms
    const d = await bench(cached, [{ n: 2 }]); // 200ms

    expect(a).to.be.a('number').above(198);
    expect(b).to.be.a('number').above(198);
    expect(c).to.be.a('number').above(198);
    expect(d).to.be.a('number').above(198);
  });

  it('Should destroy single cached key when `destroy` method is called with argument', async () => {
    const func = async (arg) => {
      await sleep(200);
      return arg.n * 2;
    };
    const cached = new Ricordo(func, { ttl: 1000 });

    const a = await bench(cached, [{ n: 1 }]); // 200ms
    const b = await bench(cached, [{ n: 2 }]); // 200ms

    cached.destroy({ n: 2 });

    const c = await bench(cached, [{ n: 1 }]); // 0ms
    const d = await bench(cached, [{ n: 2 }]); // 200ms

    expect(a).to.be.a('number').above(198);
    expect(b).to.be.a('number').above(198);
    expect(c).to.be.a('number').below(5);
    expect(d).to.be.a('number').above(198);
  });
});

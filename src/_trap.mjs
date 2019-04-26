/**
 * Config [object]:
 * - ttl [number] => time-to-live for cached keys.
 * - ideal [number] => ideal number of items to keep cached.
 * - limit [number] => n of items that triggers store behavior.
 * - force [boolean] => force deletion of key after ttl. DEFAULT: `false`.
 */

export default class _Trap {
  constructor({ ttl, ideal, limit, force = false }) {
    this.ttl = ttl;
    this.ideal = ideal;
    this.limit = limit;
    this.force = force;

    if (!ttl || ttl < 1000) throw new Error('prop `ttl` is required when setting up custom caching');
    if (this.limit && !this.ideal) throw new Error('prop `ideal` is required when setting `limit` prop');

    this.stats = new Map();
    this.store = new Map();
  }

  has(key) {
    return this.store.has(key);
  }

  get(key) {
    // Updating stats incrementing usage counter.
    const n = this.stats.get(key) || 0;
    this.stats.set(key, n + 1);

    return this.store.get(key);
  }

  set(key, value) {
    if (this.limit && this.store.size >= this.limit - 1) this.onLimit();

    // Initializing ttl.
    setTimeout(() => this.onTimeout(key), this.ttl);
    return this.store.set(key, value);
  }

  onTimeout(key) {
    // When force is set to `true` => key is delete from cache by default.
    if (this.stats.get(key) === 0 || !this.stats.has(key) || this.force) this.store.delete(key);
    else {
      this.stats.set(key, 0);
      setTimeout(() => this.onTimeout(key), this.ttl);
    }
  }

  onLimit() {
    // Sorting cache keys based on usage.
    const arr = Array.from(this.stats).sort((a, b) => b[1] - a[1]);
    arr.length = this.ideal;

    // Building new store from most used cache keys.
    const newStats = arr.map(e => [e[0], this.store.get(e[0])]);
    this.store = new Map(newStats);
  }
}

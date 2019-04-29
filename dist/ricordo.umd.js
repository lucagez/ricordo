!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.ricordo=e()}(this,function(){var t=function(t){var e=t.ttl,i=t.ideal,s=t.limit,r=t.force;if(void 0===r&&(r=!1),this.ttl=e,this.ideal=i,this.limit=s,this.force=r,e<1e3)throw new Error("`ttl` must be > 1000 ms");if(this.limit&&!this.ideal)throw new Error("prop `ideal` is required when setting `limit` prop");this.stats=new Map,this.store=new Map};t.prototype.has=function(t){return this.store.has(t)},t.prototype.get=function(t){var e=this.stats.get(t);return this.stats.set(t,e+1),this.store.get(t)},t.prototype.set=function(t,e){var i=this;return this.limit&&this.store.size>=this.limit-1&&this.onLimit(),this.ttl&&setTimeout(function(){return i.onTimeout(t)},this.ttl),this.stats.set(t,0),this.store.set(t,e)},t.prototype.clear=function(){this.store.clear()},t.prototype.delete=function(t){this.store.delete(t)},t.prototype.onTimeout=function(t){var e=this;0===this.stats.get(t)||this.force?this.store.delete(t):(this.stats.set(t,0),this.ttl&&setTimeout(function(){return e.onTimeout(t)},this.ttl))},t.prototype.onLimit=function(){var t=this,e=Array.from(this.stats).sort(function(t,e){return e[1]-t[1]});e.length=this.ideal;var i=e.map(function(e){return[e[0],t.store.get(e[0])]});this.store=new Map(i)};var e=function(e,i){var s=this;if("function"!=typeof e)throw new TypeError("`func` argument must be of type function");this.func=e,this.cache=i?new t(i):new Map;var r=function(){var t,e,i=(t=this).makeKey.apply(t,arguments);if(this.cache.has(i))return this.cache.get(i);var s=(e=this).func.apply(e,arguments);return this.cache.set(i,s),s}.bind(this);return r.destroy=function(t){t?s.cache.delete(s.makeKey(t)):s.cache.clear()},r};return e.prototype.makeKey=function(){var t=arguments[0];return arguments.length<=1?"object"==typeof t?JSON.stringify(t):t:JSON.stringify(arguments)},e});
//# sourceMappingURL=ricordo.umd.js.map

module.exports=function(t,e){if(void 0===e&&(e={}),"function"!=typeof t)throw new TypeError("func argument must be of type `function`");if("object"!=typeof e)throw new TypeError("config argument must be of type `object`");return this.store=new Map,this.func=t,function(){for(var t,e=[],r=arguments.length;r--;)e[r]=arguments[r];var n=e.length<=1?"object"==typeof e[0]?JSON.stringify(e[0]):e[0]:JSON.stringify(e);if(this.store.has(n))return this.store.get(n);var o=(t=this).func.apply(t,e);return this.store.set(n,o),o}.bind(this)};
//# sourceMappingURL=ricordo.js.map

!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):t.ricordo=n()}(this,function(){return function(t){if("function"!=typeof t)throw new TypeError("func argument must be of type `function`");return this.map=new Map,this.func=t,function(){for(var t,n=[],e=arguments.length;e--;)n[e]=arguments[e];var i=n.length<=1?"object"==typeof n[0]?JSON.stringify(n[0]):n[0]:JSON.stringify(n);if(this.map.has(i))return this.map.get(i);var f=(t=this).func.apply(t,n);return this.map.set(i,f),f}.bind(this)}});
//# sourceMappingURL=ricordo.umd.js.map

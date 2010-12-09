/*
    Copyright (c) 2010 Ivo Wetzel.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/

function Class(ctor) {
    ctor = ctor || function(){};
    function clas() {
        ctor.apply(this, arguments);
    }
    function wrap(caller, object) {
        object = object || clas.call;
        return function() {
            return object.apply(caller, arguments);
        };
    }
    
    var proto = {};
    clas.init = wrap(ctor);
    clas.extend = function(exts) {
        if (exts instanceof Function) return exts.extend(proto);
        
        for(var e in exts) {
            if (!exts.hasOwnProperty(e)) continue;
            
            var value = exts[e],
                type = Object.prototype.toString.call(value).slice(8, -1);
            
            if (/^\$/.test(e)) {
                proto[e] = type === 'Array' ? value.slice() : value;
                if (type === 'Object') {
                    proto[e] = {};
                    for(var f in value) {
                        proto[e][f] = value[f];
                    }
                }
                clas[e] = clas.prototype[e] = type === 'Function' ? wrap(clas, value) : value;
            
            } else if (type === 'Function') {
                clas[e] = wrap(proto[e] = clas.prototype[e] = value);
            }
        }
        return clas;
    };
    for(var i = ctor.init ? 0 : 1, l = arguments.length; i < l; i++) {
        arguments[i].extend(clas);
    }
    return clas;
}
typeof window === 'undefined' ? exports.Class = Class : null;


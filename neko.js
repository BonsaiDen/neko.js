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
    function clas() {
        ctor.apply(this, arguments);
    }
    function wrap(object, caller) {
        return function() {
            return object.apply(caller, arguments);
        };
    }
    clas.init = wrap(clas.call, ctor);
    clas.extend = function(exts) {
        for(var e in exts) {
            if (exts.hasOwnProperty(e)) {
                var isStatic = e[0] === '$', value = exts[e];
                if (typeof value === 'function') {
                    clas[e] = isStatic ? wrap(value, clas) : wrap(clas.call, clas.prototype[e] = value);
                
                } else if (isStatic) {
                    clas[e] = value;
                }
            }
        }
        return clas;
    };
    for(var i = 1, l = arguments.length; i < l; i++) {
        clas.extend(arguments[i].prototype);
    }
    return clas;
}
typeof window === 'undefined' ? exports.Class = Class : null;


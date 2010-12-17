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
    ctor = ctor || function() {};
    function clas() {
        ctor.apply(this, arguments);
    }
    function wrap(caller, object) {
        object = object || clas.call;
        return function() {
            return object.apply(caller, arguments);
        };
    }
    function is(type, obj) {
        return Object.prototype.toString.call(obj).slice(8, -1) === type;
    }

    var proto = {};
    clas.init = wrap(ctor);
    clas.extend = function(ext) {
        if (is('Function', ext)) return ext.extend(proto);

        for(var e in ext) {
            if (!ext.hasOwnProperty(e)) continue;

            var val = ext[e];
            if (/^\$/.test(e)) {
                proto[e] = is('Array', val) ? val.slice() : val;
                if (is('Object', val)) {
                    proto[e] = {};
                    for(var f in val) {
                        proto[e][f] = val[f];
                    }
                }
                clas[e] = clas.prototype[e] =
                          is('Function', val) ? wrap(clas, val) : val;

            } else if (is('Function', val)) {
                clas[e] = wrap(proto[e] = clas.prototype[e] = val);
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


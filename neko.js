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

(function() {
    'use strict';

    function is(type, obj) {
        return Object.prototype.toString.call(obj).slice(8, -1) === type;
    }

    function copy(val) {
        if (is('Object', val)) {
            var obj = {};
            for (var f in val) {
                obj[f] = val[f];
            }
            return obj;

        } else {
            return is('Array', val) ? val.slice() : val;
        }
    }

    function wrap(caller, obj) {
        obj = obj || Function.call;
        return function() {
            return obj.apply(caller, arguments);
        };
    }

    function Class(ctor) {
        ctor = ctor || function() {};
        if (is('Object', ctor)) {
            return Class(null, ctor);
        }

        function clas() {
            ctor.apply(this, arguments);
        }

        var proto = {};
        clas.init = wrap(ctor);
        clas.extend = function(ext) {
            if (is('Function', ext)) return ext.extend(proto);

            for (var e in ext) {
                if (!ext.hasOwnProperty(e)) continue;

                var val = ext[e], func = is('Function', val);
                if (/^\$/.test(e)) {
                    proto[e] = copy(val);
                    clas[e] = clas.prototype[e] = func ? wrap(clas, val) : val;

                } else if (func) {
                    clas[e] = wrap(proto[e] = clas.prototype[e] = val);
                }
            }
            return clas;
        };

        for (var i = ctor.hasOwnProperty('init') ? 0 : 1,
                 l = arguments.length; i < l; i++) {

            var arg = arguments[i];
            is('Object', arg) ? clas.extend(arg) : arg.extend(clas);
        }
        return clas;
    }

    (typeof window === 'undefined' ? exports : window).Class = Class;
})();


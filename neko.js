/*
   Copyright (c) 2010-2011 Ivo Wetzel.

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

    // Class (constructor, [base1[, base2[, ... baseN]],], [methods])
    // Class (constructor, [base1[, base2[, ... baseN]],]);
    // Class (methods)
    function Class(ctor) {
        if (is('Object', ctor)) {
            // no constructor function passed
            return Class(null, ctor);

        } else {
            return base(arguments, ctor || function() {});
        }
    }

    var global = this;
    function base(args, ctor) {
        var plain = false;

        // Instance constructor
        function clas() {
            if (this !== global) {
                plain ? (plain = false) : ctor.apply(this, arguments);
                return this;

            } else {
                // Case of missing new keyword
                plain = true;
                return clas.apply(new clas(), arguments);
            }
        }

        var properties = {};
        clas.init = bind(ctor);
        clas.extend = function(obj) {
            if (is('Function', obj)) {
                // Extend the class that wants to inherit
                if (obj.hasOwnProperty('extend')) {
                    return obj.extend(properties);
                }

            } else {
                for(var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        extend(clas, properties, obj, i);
                    }
                }
            }
            return clas;
        };

        // Extend and inherit
        var i = is('Function', ctor) && ctor.hasOwnProperty('init') ? 0 : 1;
        for(var l = args.length; i < l; i++) {
            if (is('Object', args[i])) {
                clas.extend(args[i]);

            } else {
                // We're inheriting, so we need access to the other class's
                // 'properties' object, therefore, call that class which then
                // calls the extend method of this class and passes its
                // 'properties' object
                args[i].extend(clas);
            }
        }
        return clas;
    }

    function extend(clas, properties, obj, i) {
        var val = obj[i], func = is('Function', val);
        if (/^\$/.test(i)) {

            // Statics
            clas[i] = clas.prototype[i] = func ? bind(clas, val) : val;
            properties[i] = clone(val);

        } else if (func) {
            clas[i] = bind(val);
            properties[i] = clas.prototype[i] = val;
        }
    }

    function clone(val) {
        if (is('Object', val)) {
            var obj = {};
            for(var f in val) {
                if (val.hasOwnProperty(f)) {
                    obj[f] = val[f];
                }
            }
            return obj;

        } else {
            return is('Array', val) ? val.slice() : val;
        }
    }

    function bind(caller, obj) {
        obj = obj || Function.call;
        return function() {
            return obj.apply(caller, arguments);
        };
    }

    function is(type, obj) {
        return Object.prototype.toString.call(obj).slice(8, -1) === type;
    }

    (typeof window === 'undefined' ? exports : window).Class = Class;
})();


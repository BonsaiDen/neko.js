// Make sure it works in the HTML file
if (typeof window === 'undefined') {
    var Class = require('./../lib/neko').Class;

} else {
    var exports = {};
}

function is(type, obj) {
    return Object.prototype.toString.call(obj).slice(8, -1) === type;
}


// Neko.js Tests ----------------------------------------------------------------
// ------------------------------------------------------------------------------
exports.testClassCreation = function(test) {
    test.expect(4);

    var Foo = Class();
    test.ok(is('Function', Foo), 'class should be created');
    test.ok(is('Function', Foo.init), 'class should have unbound constructor');
    test.ok(is('Function', Foo.extend), 'class should have an extend method');

    var foo = new Foo();
    test.ok(is('Object', foo), 'instance should have been created');
    test.done();
};


exports.testClassConstruction = function(test) {
    var count = 0;
    var Dog = Class(function(name) {
        count++;
        this.name = name;

    }, {
        speak: function(text) {
            return text;
        }
    });
    test.expect(8);

    var puppy1 = new Dog('Foo');
    test.equal(count, 1,
                'constructor should only get called once');

    test.ok(is('Object', puppy1),
                'new constructor should return instance');

    test.equal(puppy1.name, 'Foo',
                'new ctor instance should have correct name');

    test.equal(puppy1.speak('wau'), 'wau',
                'new ctor instance method should work');

    count = 0;
    var puppy2 = Dog('Foo');
    test.equal(count, 1,
                'constructor should only get called once');

    test.ok(is('Object', puppy2),
                'plain constructor should return instance');

    test.equal(puppy2.name, 'Foo',
                'plain ctor instance should have correct name');

    test.equal(puppy2.speak('wau'), 'wau',
                'plain ctor instance method should work');

    test.done();
};


exports.testInstanceProperties = function(test) {
    var Foo = Class(function() {

    }, {
        invalidProp: []
    });
    var foo = new Foo();

    test.expect(2);
    test.equal(Foo.invalidProp, undefined,
                'no property should be defined on the class');

    test.equal(foo.invalidProp, undefined,
                'no property should be defined on the instance');

    test.done();
};

function createAnimal() {
    return Class(function(name) {
        this.name = name;

    }, {
        speak: function(words) {
            return words;
        }
    });
}

exports.testSimpleClass = function(test) {
    var Animal = createAnimal();
    var bee = new Animal('Maja');
    test.expect(3);
    test.equal(bee.name, 'Maja',
                'instance property should have the correct value');

    test.equal(bee.speak('Willi'), 'Willi',
                'instance method should return correct value');

    test.equal(Animal.speak(bee, 'Willi'), 'Willi',
                'unbound method should return correct value');

    test.done();
};


function createCat(Animal) {
    return Class(function(name, color) {
        Animal.init(this, name);
        this.color = color;

    }, Animal, {
        meow: function() {
            return this.speak('My name is ' + this.name + ' and I\'m '
                              + this.color + '.');
        }
    });
}

exports.testInheritance = function(test) {
    var Animal = createAnimal();
    var Cat = createCat(Animal);

    var kitten = new Cat('Meow', 'purple');

    test.expect(6);
    test.ok(is('Function', Cat.speak),
                'class should inherit method');

    test.equal(Cat.speak(kitten, 'Meow'), 'Meow',
                'unbound method should return correct value');

    test.equal(kitten.speak('Meow'), 'Meow',
                'method should return correct value');

    test.equal(kitten.name, 'Meow',
                'name property should have correct value');

    test.equal(kitten.color, 'purple',
                'color property should have correct value');

    test.equal(kitten.meow(), 'My name is Meow and I\'m purple.',
                'instance method should return the correct value');

    test.done();
};


function createBalloonCat(Balloon, Cat) {
    return Class(function(name, color, size, height) {
        Cat.init(this, name, color);
        Balloon.init(this, size, height);
        this.color = color;

    }, Cat, Balloon, {
        meow: function() {
            return Cat.meow(this) + ' I\'m currently flying at '
                   + this.fly() + ' feet!';
        }
    });
}

exports.testMultipleInheritance = function(test) {
    var configObject = {'foo': 42};
    var Balloon = createBalloon(configObject);
    var Animal = createAnimal();
    var Cat = createCat(Animal);
    var BalloonCat = createBalloonCat(Balloon, Cat);
    configObject.foo = 35;
    Balloon.$config.color = 'red';

    var flyingCat = new BalloonCat('Toro', 'orange', 20, 70);

    test.expect(9);
    test.ok(is('Array', BalloonCat.$list),
                'class should have static list property');

    test.equal(BalloonCat.$list.length, 1,
                'static list should only contain one instance');

    test.equal(BalloonCat.$list[0], flyingCat,
                'static list should only the correct instance')

    test.equal(BalloonCat.$count(flyingCat), 1,
                'static method should return correct count');

    test.equal(BalloonCat.$config.color, 'blue',
                'static $config property should be a shallow clone');

    test.equal(BalloonCat.$config.object, configObject,
                'static $config object should be a shallow clone');

    test.equal(flyingCat.name, 'Toro',
                'instance should have correct name property value');

    test.equal(flyingCat.color, 'orange',
                'instance should have correct color property value');

    test.equal(flyingCat.meow(),
                'My name is Toro and I\'m orange.'
                + ' I\'m currently flying at 70 feet!',
                'instance method should return the correct value');

    test.done();
};


function createBalloon(config) {
    return Class(function(size, altitude) {
        this.size = size;
        this.altitude = altitude;
        this.$list.push(this);

    }, {
        fly: function() {
            return this.altitude;
        },
        $list: [],
        $config:  {'color': 'blue', 'object': config},
        $count: function() {
            return this.$list.length;
        }
    });
}

exports.testStaticMethodsProperties = function(test) {
    var configObject = {'foo': 42};
    var Balloon = createBalloon(configObject);
    var hotAirBalloon = new Balloon();

    test.expect(9);
    test.ok(is('Array', Balloon.$list),
                'class should have static list property');

    test.equal(Balloon.$list.length, 1,
                'static list should only contain one instance');

    test.equal(Balloon.$list[0], hotAirBalloon,
                'static list should only the correct instance')

    test.equal(Balloon.$count(hotAirBalloon), 1,
                'static method should return correct count');

    test.equal(Balloon.$config.color, 'blue',
                'static $config property should be a shallow clone');

    test.equal(Balloon.$config.object, configObject,
                'static $config object should be a shallow clone');

    test.equal(hotAirBalloon.$list, Balloon.$list,
                'instance should refer the static list property');

    test.equal(hotAirBalloon.$config, Balloon.$config,
                'instance should refer the static config property');

    test.equal(hotAirBalloon.$count, Balloon.$count,
                'instance should refer the static method');

    test.done();
};


function createLogger() {
    return Class({
        $log: function(str) {
            return 'Log: ' + str;
        }
    });
}

exports.testAbstract = function(test) {
    var Logger = createLogger();

    test.expect(2);
    test.ok(is('Function', Logger.init),
                'class should have a implicit default constructor');

    test.equal(Logger.$log('Test'), 'Log: Test',
                'static log method should log the correct message');

    test.done();
};


exports.testTemplates = function(test) {
    var Logger = createLogger();
    var Thing = Class(function() {
        this.thingsDone = 0;

    }, {
        action: function() {
            this.thingsDone++;
            return this.doAction();
        }
    });
    var Sub = Class(Thing, Logger, {
        doAction: function() {
            return 'Doing some thing!';
        }
    });
    var sub = new Sub();

    test.expect(6);
    test.equal(sub.thingsDone, 0,
                'instance should have initiliazed thingsDone');

    test.ok(is('Function', Sub.action),
                'class should inherit method');

    test.ok(is('Function', Sub.$log),
                'class should inherit static method');

    test.ok(is('Function', Sub.doAction),
                'class should implement method');

    test.equal(sub.action(), 'Doing some thing!',
                'method should call and return implemented method');

    test.equal(sub.thingsDone, 1,
                'instance should have correct count of thingsDone');

    test.done();
};


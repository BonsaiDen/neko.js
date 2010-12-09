var assert = require('assert');
var Class = require('./neko').Class;


// Simple classes --------------------------------------------------------------
var Animal = Class(function(name) {
    this.name = name;

}).extend({
    speak: function(words) {
        return words;
    },
    
    // static method of Animal
    $info: function(animal) {
        return animal.name;
    }
});

var bee = new Animal('Maja');
assert.notEqual(Animal.$info, undefined, 'Class Animal should have a static method called $info');
assert.equal(Animal.$info(bee), 'Maja', 'Class Animal static method $info returned the wrong value');

assert.equal(bee.name, 'Maja', 'bee has wrong name');
assert.equal(bee.speak('Willi!'), 'Willi!', 'bee said the wrong thing');
assert.notEqual(bee.$info, undefined, 'bee should have a static method $info');

var configObject = {'foo': 42};
var Balloon = Class(function(size, altitude) {
    this.size = size;
    this.altitude = altitude;
    this.$list.push(this);

}).extend({
    fly: function() {
        return this.altitude;
    },
    
    invalidList: [], // invalid, class variables need to start with a $
    
    $list: [],
    
    $config:  {'color': 'blue', 'object': configObject},
    
    $count: function() {
        return this.$list.length;
    }
});


var hotAirBalloon = new Balloon(50, 128);
assert.notEqual(Balloon.$count, undefined, 'Class Balloon should have a static method $count');
assert.notEqual(Balloon.$list, undefined, 'Class Balloon should have a static property $list');
assert.equal(Balloon.invalidList, undefined, 'Class Balloon should not have a property invalidList');
assert.equal(Balloon.$list.length, 1, 'Static property $list of class Balloon should have a length of 1');
assert.equal(Balloon.$count(), Balloon.$list.length, 'Static method $count of class Balloon should return the length of the static property $list');
assert.equal(Balloon.$config.color, 'blue', 'Static property $conifg should be a shallow clone');
assert.equal(Balloon.$config.object, configObject, 'Static property $config should be a shallow clone');

assert.equal(hotAirBalloon.size, 50, 'hotAirBalloon has the wrong size');
assert.equal(hotAirBalloon.altitude, 128, 'hotAirBalloon is at the wrong altitude');
assert.equal(hotAirBalloon.fly(), 128, 'hotAirBalloon.fly() tells the wrong altitude');

assert.notEqual(hotAirBalloon.$count, undefined, 'hotAirBalloon should have a static method $count');
assert.notEqual(hotAirBalloon.$list, undefined, 'hotAirBalloon should have a static property $list');
assert.equal(hotAirBalloon.invalidList, undefined, 'hotAirBalloon should not have a property invalidList');


// Single Inherited Class ------------------------------------------------------
var Cat = Class(function(name, color) {
    Animal.init(this, name);
    this.color = color;

}, Animal).extend({
    meow: function() {
        return this.speak('My name is ' + this.name + ' and I\'m ' + this.color + '!');
    }
});

var kitty = new Cat('Meow', 'purple');
assert.notEqual(kitty.speak, undefined, 'kitty should have a speak method');
assert.equal(kitty.name, 'Meow', 'kitty has the wrong name');
assert.equal(kitty.color, 'purple', 'kitty has the wrong color');
assert.equal(kitty.meow(), 'My name is Meow and I\'m purple!', 'kitty.meow() says the wrong things');


// Double Inherited Class ------------------------------------------------------
var BalloonCat = Class(function(name, color, size, height) {
    Cat.init(this, name, color);
    Balloon.init(this, size, height);
    this.color = color;

}, Cat, Balloon).extend({
    meow: function() {
        return Cat.meow(this) + ' I\'m currently flying at ' + this.fly() + ' feet!';
    }
});
configObject.foo = 35;
Balloon.$config.color = 'red';

var flyingCat = new BalloonCat('Toro', 'orange', 20, 70);
assert.notEqual(BalloonCat.$list, undefined, 'Class BalloonCat should have a static property $list');
assert.notEqual(BalloonCat.$count, undefined, 'Class BalloonCat should have a static method $count');
assert.equal(BalloonCat.$list.length, 1, 'Static property $list of class BalloonCat should have a length of 1');
assert.equal(BalloonCat.$count(), 1, 'Static method $count of class BalloonCat should return 1');
assert.equal(BalloonCat.$config.color, 'blue', 'Static property $conifg should be a shallow clone');
assert.equal(BalloonCat.$config.object, configObject, 'Static property $conifg should be a shallow clone');

assert.equal(flyingCat.name, 'Toro', 'flyingCat has the wrong name');
assert.equal(flyingCat.color, 'orange', 'flyingCat has the wrong color');
assert.notEqual(flyingCat.$list, undefined, 'flyingCat should have a static property $list');
assert.equal(flyingCat.meow(),
             'My name is Toro and I\'m orange! I\'m currently flying at 70 feet!',
             'flyingcat.meow() says the wrong things');


// Templates -------------------------------------------------------------------
var CuteThing = Class(function() {
    this.cuteThingsDone = 0;

}).extend({
    cuteAction: function() {
        this.cuteThingsDone++;
        return this.doAction(); // abstract
    }
});

var CuteLogger = Class().extend({
    $log: function(str) {
        console.log('CuteLog: ' + str);
    }
});
assert.equal(CuteLogger.init instanceof Function, true, 'Class CuteLogger should have a implicit default constructor');

// Just pass the class as the constructor
var Kitten = Class(CuteThing, CuteLogger).extend({
    doAction: function() {
        return 'Doing some cute kitten thing!';
    }
});

var kitten = new Kitten();
assert.notEqual(Kitten.cuteAction, undefined, 'Class Kitten should inherit method cuteAction');
assert.notEqual(Kitten.$log, undefined, 'Class Kitten should have a static method $log');
assert.notEqual(Kitten.doAction, undefined, 'Class Kitten should implement doAction');
assert.equal(kitten.cuteAction(), 'Doing some cute kitten thing!', 'kitten doAction returns the wrong value');
assert.equal(kitten.cuteThingsDone, 1, 'kitten instance should have a cuteThingsDone count of 1');


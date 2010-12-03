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
assert.equal(bee.name, 'Maja', 'bee has wrong name');
assert.equal(bee.speak('Willi!'), 'Willi!', 'bee said the wrong thing');
assert.notEqual(Animal.$info, undefined, 'Class Animal should have a static method called $info');
assert.equal(Animal.$info(bee), 'Maja', 'Class Animal static method $info returned the wrong value');
assert.equal(bee.$info, undefined, 'bee should not have a method $info');

var Balloon = Class(function(size, altitude) {
    this.size = size;
    this.altitude = altitude;

}).extend({
    fly: function() {
        return this.altitude;
    }
});

var hotAirBalloon = new Balloon(50, 128);
assert.equal(hotAirBalloon.size, 50, 'hotAirBalloon has the wrong size');
assert.equal(hotAirBalloon.altitude, 128, 'hotAirBalloon is at the wrong altitude');
assert.equal(hotAirBalloon.fly(), 128, 'hotAirBalloon.fly() tells the wrong altitude')
assert.equal(hotAirBalloon.$info, undefined, 'hotAirBalloon should not have a method $info');
assert.equal(Balloon.$info, undefined, 'Class Balloon should not have a static method $info');


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

var flyingCat = new BalloonCat('Toro', 'orange', 20, 70);
assert.equal(flyingCat.name, 'Toro', 'flyingCat has the wrong name');
assert.equal(flyingCat.color, 'orange', 'flyingCat has the wrong color');
assert.equal(flyingCat.meow(),
             'My name is Toro and I\'m orange! I\'m currently flying at 70 feet!',
             'flyingcat.meow() says the wrong things');


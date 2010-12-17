// Neko.js Test Cases ----------------------------------------------------------
// ----------------------------------------------------------------------------- 
var assert = require('assert');
var Class = require('./neko').Class;

var equal = assert.equal;
var isnot = assert.notEqual;


// Plain vanilla Class ---------------------------------------------------------
// ----------------------------------------------------------------------------- 
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


// Test a simple Class --------------------------------------------------------- 
var bee = new Animal('Maja');
isnot(Animal.$info, undefined,
	  'Class Animal should have a static method called $info');

equal(Animal.$info(bee), 'Maja',
	  'Class Animal static method $info returned the wrong value');

equal(bee.name, 'Maja', 'bee has wrong name');
equal(bee.speak('Willi!'), 'Willi!', 'bee said the wrong thing');
isnot(bee.$info, undefined, 'bee should have a static method $info');


// Class with static methods and properties ----------------------------------- 
// ----------------------------------------------------------------------------- 
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


// Test a class with static stuff ----------------------------------------------
var hotAirBalloon = new Balloon(50, 128);
isnot(Balloon.$count, undefined,
	  'Class Balloon should have a static method $count');

isnot(Balloon.$list, undefined,
	  'Class Balloon should have a static property $list');

equal(Balloon.invalidList, undefined,
	  'Class Balloon should not have a property invalidList');

equal(Balloon.$list.length, 1,
	  'Static property $list of class Balloon should have a length of 1');

equal(Balloon.$count(), Balloon.$list.length,
	  'Static method $count of class Balloon should return the length '
	  + 'of the static property $list')

equal(Balloon.$config.color, 'blue',
	  'Static property $conifg should be a shallow clone');

equal(Balloon.$config.object, configObject,
	  'Static property $config should be a shallow clone');

equal(hotAirBalloon.size, 50,
	  'hotAirBalloon has the wrong size');

equal(hotAirBalloon.altitude, 128,
	  'hotAirBalloon is at the wrong altitude');
			 
equal(hotAirBalloon.fly(), 128,
	  'hotAirBalloon.fly() tells the wrong altitude');

isnot(hotAirBalloon.$count, undefined,
	  'hotAirBalloon should have a static method $count');

isnot(hotAirBalloon.$list, undefined,
	  'hotAirBalloon should have a static property $list');

equal(hotAirBalloon.invalidList, undefined,
      'hotAirBalloon should not have a property invalidList');


// Single Inherited Class ------------------------------------------------------
// ----------------------------------------------------------------------------- 
var Cat = Class(function(name, color) {
    Animal.init(this, name);
    this.color = color;

}, Animal).extend({
    meow: function() {
        return this.speak('My name is ' + this.name + ' and I\'m '
			   + this.color + '!');
    }
});


// Test a inheriting Class -----------------------------------------------------
var kitty = new Cat('Meow', 'purple');
isnot(kitty.speak, undefined, 'kitty should have a speak method');
equal(kitty.name, 'Meow', 'kitty has the wrong name');
equal(kitty.color, 'purple', 'kitty has the wrong color');
equal(kitty.meow(), 'My name is Meow and I\'m purple!',
                    'kitty.meow() says the wrong things');


// Double Inherited Class ------------------------------------------------------
// ----------------------------------------------------------------------------- 
var BalloonCat = Class(function(name, color, size, height) {
    Cat.init(this, name, color);
    Balloon.init(this, size, height);
    this.color = color;

}, Cat, Balloon).extend({
    meow: function() {
        return Cat.meow(this) + ' I\'m currently flying at '
			   + this.fly() + ' feet!';
    }
});
configObject.foo = 35;
Balloon.$config.color = 'red';


// Test a double inheriting Class ----------------------------------------------
var flyingCat = new BalloonCat('Toro', 'orange', 20, 70);
isnot(BalloonCat.$list, undefined,
	  'Class BalloonCat should have a static property $list');
				
isnot(BalloonCat.$count, undefined,
	  'Class BalloonCat should have a static method $count');

equal(BalloonCat.$list.length, 1,
	  'Static property $list of class BalloonCat should have a length of 1');

equal(BalloonCat.$count(), 1,
	  'Static method $count of class BalloonCat should return 1');

equal(BalloonCat.$config.color, 'blue',
	  'Static property $conifg should be a shallow clone');

equal(BalloonCat.$config.object, configObject,
      'Static property $conifg should be a shallow clone');
			 
equal(flyingCat.name, 'Toro', 'flyingCat has the wrong name');
equal(flyingCat.color, 'orange', 'flyingCat has the wrong color');
isnot(flyingCat.$list, undefined,
	  'flyingCat should have a static property $list');

equal(flyingCat.meow(),
      'My name is Toro and I\'m orange! I\'m currently flying at 70 feet!',
      'flyingcat.meow() says the wrong things');


// Template Classes ------------------------------------------------------------
// ----------------------------------------------------------------------------- 
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
equal(CuteLogger.init instanceof Function, true,
	  'Class CuteLogger should have a implicit default constructor');


// Just pass the class as the constructor
var Kitten = Class(CuteThing, CuteLogger).extend({
    doAction: function() {
        return 'Doing some cute kitten thing!';
    }
});


// Test templates -------------------------------------------------------------- 
var kitten = new Kitten();
isnot(Kitten.cuteAction, undefined,
	  'Class Kitten should inherit method cuteAction');

isnot(Kitten.$log, undefined,
	  'Class Kitten should have a static method $log');

isnot(Kitten.doAction, undefined,
	  'Class Kitten should implement doAction');

equal(kitten.cuteAction(), 'Doing some cute kitten thing!',
	  'kitten doAction returns the wrong value');

equal(kitten.cuteThingsDone, 1,
      'kitten instance should have a cuteThingsDone count of 1');

console.log('PASSED ALL TESTS');


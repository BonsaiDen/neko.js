neko.js - Lightweight JavaScript Classes
========================================

Neko.js provides classical inheritance for JavaScript, it does so in a
lightweight manner with nearly no overhead when on instantiation.

It works both in browsers (IE6+) and all versions of Node.js.

Features
--------

 - Multiple inheritance
 - Static methods and properties
 - Really fast creation of instances
 - Ability to call unbound methods
 - Passing Classes as constructors


Syntax
------

    Class (constructor, [base1[, base2[, ... baseN]],], [methods])
    Class (constructor, [base1[, base2[, ... baseN]],]).extend(methods)
    Class (methods)

**Creating some Classes**

    // A simple Animal class
    var Animal = Class(function(name) { // the constructor
        this.name = name; // an instance variable

    }, { // extending the class with some methods
        speak: function(words) { // a simple method
            console.log(words);
        }
    });


    // Let's create a class called "Cat" that inherits from Animal
    var Cat = Class(function(name, color) {

        Animal.init(this, name); // call Animals constructor, basically super()
        this.color = color;

        // private variable and a getter
        var fur = 'soft';
        this.furType = function() {
            return fur;
        }

        this.$list.push(this); // push this instance into the static list of Cat

    }, Animal, {  // base classes
        meow: function() {
            this.speak('Meow! My name is ' + this.name + '.'); // calling the inherited method
        },

        getColor: function() {
            return this.color;
        },

        $list: [], // let the Cat class keep track of the cats, with a static property
                   // static properties are shallow copies per class

        $info: function(cat) { // static method of Cat, note the $ prefix
            return {name: cat.name, color: cat.color, fur: cat.furType()};
        },

        $listCats: function() {
            return this.$list; // this inside static methods refers to the class
        }
    });


**Trying them out**

    > kitten = new Cat('Kitty', 'black'); // create a kitten
    { name: 'Kitty', color: 'black', furType: [Function] }

    > kitten.meow(); // call the instance method
    Meow! My name is Kitty.

    > Cat.meow(kitten); // we can also call the unbound method

    > kitten.getColor(); // another call
    black

    > Cat.$info(kitten); // call the static method
    { name: 'Kitty', color: 'black', fur: 'soft' }

    > kitten.$listCats() // get a list of the cats, by calling the static method
    [ { name: 'Kitty', color: 'black', furType: [Function] } ]


**More Tricks**

    // Creating some kind of a template
    var CuteThing = Class(function() {
        this.cuteThingsDone = 0;

    }, {
        cuteAction: function() {
            this.cuteThingsDone++;
            return this.doAction(); // doAction is abstract
        }
    });

    // Just pass the CuteThing class as the constructor
    var Kitten = Class(CuteThing, {
        doAction: function() {
            return 'Doing some cute kitten thing!';
        }
    });

    var Puppy = Class(CuteThing, {
        doAction: function() {
            return 'Doing some cute puppy thing!';
        }
    });

    > new Kitten().cuteAction()
    'Doing some cute kitten thing!'

    > new Puppy().cuteAction()
    'Doing some cute puppy thing!'


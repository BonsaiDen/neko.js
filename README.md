neko.js - JavaScript classes for cats!
======================================

**neko.js Features**

 - Multiple inheritance
 - Static methods and properties
 - Really fast creation of instances
 - Ability to call unbound methods


**Creating some Classes**

    // A simple Animal class
    var Animal = Class(function(name) { // the constructor
        this.name = name; // an instance variable

    }).extend({ // extending the class with some methods
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
        
        Cat.$list.push(this); // push this instance into the static list
    
    }, Animal).extend({  // base classes
        meow: function() {
            this.speak('Meow! My name is ' + this.name + '.'); // calling the inherited method
        },
        
        getColor: function() {
            return this.color;
        },
        
        $list: [], // let the Cat class keep track of the cats with a static property
        
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

    > Cat.$listCats() // list the instances contained in the static property
    [ { name: 'Kitty', color: 'black', furType: [Function] } ]



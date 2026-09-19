// Classical inheritance with prototype chain
// define parent's class
function Person(name, age){	
    // define parent's properties
    this.name = name;
    this.age = age;
}
// define parent's methods
Person.prototype.getName = function(){return this.name;}
Person.prototype.getAge = function(){return this.age;}

// define child's class
function Player(name, age, level){
    Person.call(this, name, age);
    this.level = level;
}

// assign an object to `Player.prototype` by creating a new object, and set `Person.prototype` as the prototype of the newly created object.
Player.prototype = Object.create(Person.prototype); 
// change the constructor function back to child's constructor.
Player.prototype.constructor = Player;
// define child's method
Player.prototype.getLevel = function(){return this.level;}

// prototype chain: Player.prototype > Person.prototype > Object.prototype > null

let o = new Player("Peter", 20, 15);
console.log(o.getLevel()); // 15
console.log(o.getAge()); // 20
console.log(o.getName()); // Peter


// Classical inheritance with prototype chain
function Person(name, age){	
    this.name = name;
    this.age = age;
}
Person.prototype.getName = function(){return this.name;}
Person.prototype.getAge = function(){return this.age;}

function Player(name, age, level){
    Person.call(this, name, age);
    this.level = level;
}
Player.prototype = Object.create(Person.prototype);
Player.prototype.constructor = Player;
Player.prototype.getLevel = function(){return this.level;}

let o = new Player("Peter", 20, 15);


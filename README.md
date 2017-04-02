# Architect.js
[![Build Status](https://travis-ci.org/JJK801/architect.svg?branch=master)](https://travis-ci.org/JJK801/architect)
[![Coverage Status](https://coveralls.io/repos/github/JJK801/architect/badge.svg?branch=master)](https://coveralls.io/github/JJK801/architect?branch=master)

Large projects to build ? Take an architect !

Architect will help you to makes your dream a reality by providing solid schema and models from the constraints you shared with him.

This project aims to produce a real-time data validation to make sure everything stays correct at any time.

## Installation

```shell
npm install architect.js --save
```

## Usage

By default architect.js uses [Joi](https://github.com/hapijs/joi) library for validation but is extensible to any validation library via a custom adapter.

Validation descriptor is used by the validation adapter to instanciate the validator. So architect.js validation features are just limited to the validation backend capabilities.

### Schema

The schema layer takes your constraints as input and help you to ensure they are respected along your app runs/grows.

#### Validation

```javascript
import {Schema} from 'architect.js'
// Let's choose a cat to the pet shop with our architect

const catValidator = new Schema({
	name: {
		_type: "string",
		invalid: ["kitty", "felix"] // this names really sucks for a cat ...
	},
	age:  "number",
	paws: {
		_type: "number",
		min: 0,
		max: 4  // Until the science change it ...
	},
	colors: {
		_type: "array",
		items: [{
			_type: "string",
			valid: ["white", "black", "red"] // Please, find me the red one !
		}],
		min: 1,
		max: 3
	}
});

const cats = [
	{
		name:   "felix",
		age:    2,
		paws:   4,
		colors: ["black", "white"]
	},
	{
		name:   "hulk",
		age:    5,
		paws:   3,
		colors: ["green"]
	},
	{
		name:   "snowball",
		age:    1,
		paws:   4,
		colors: ["white"]
	}
];

const myNewCat = cats.find((cat) => catValidator.validate(cat) === true);

console.log("My new cat is:", myNewCat);
/*
{
	name:  "snowball",
	age:   1,
	paws:  4,
	color: "white"
}
*/
```

So my new cat is snowball, because felix's name sucks and hulk is green.

Okay! nothing new here, just a schema validation module, but...

```javascript
const snowball = catValidator.proxify(myNewCat);

// Let colorize snowball in yellow (don't use toxic products to do so)

try {
	snowball.colors = ["yellow"];
} catch (e) {
	console.error("Can't paint snowball in yellow"); // Throws an error, as i specified that i only want white, black or red cat.
}


// Let's try red ?

snowball.colors = ["red"];

console.log("snowball's color is now:", snowball.colors); // => ['red']

// oh yeah, a cat from hell !
// let's try making it's paws blue !

try {
	snowball.colors.push("blue"); // Yeah, we also validate incoming data
} catch (e) {
	console.error("Can't paint snowball's paws in blue"); // Throws an error, as i specified that i only want white, black or red cat.
}

// you can now even try by cutting/grafting paws :D
```

And now ? first, we have a red cat (which is so cool!), and our architect did a great job !

/!\ No kittens were actually abused during this demonstration.

Validation is not shiny enough ? see, below:

#### Casting

Snowball is now a beautiful red cat. Let's try some modification on it.

```javascript
// What if i try to change it's age like it ?
/*
For those who where sleeping, catValidator.age is "number"
*/

try {
	snowball.age = "2";
} catch (e) {
	// What ? no error thrown ? your validation sucks man !
}

// calm down ! every incoming value is type-casted (as far as the validation library can), even for dates, etc...

console.log("Snowball's age is:", snowball.age); // => 2
console.log("Snowball's age is of type:", typeof snowball.age); // => number
```

#### Proxying

Okay, we proxified a cat, but is it still a cat or is it something weird containing a cat (like Schrödinger box, huh ?)?

Let's see it:

```javascript
class Cat {}

const shrodinger = catValidator.proxify(new Cat());

console.log("shrodinger constructor is:", shrodinger.constructor.name); // => Cat
console.log("is shrodinger instance of cat ?", shrodinger instanceof Cat); // => true
```

The magic happens thanks to new amazing ES6 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) classes.

Now you know ! let's use and abuse it for your own safety.

Retrieve the full example script [here](./examples/cat.js):

```shell
./node_modules/.bin/babel-node examples/cat.js
```

### Model

Coming soon, it's beer time...

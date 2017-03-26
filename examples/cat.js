/* eslint-disable no-console, require-jsdoc, valid-jsdoc */

import { Schema } from '../lib';
import Log from 'log';

const log = new Log('notice');

log.notice("#################################");
log.notice("#### Functional Example: Cat ####");
log.notice("#################################");

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

export const cats = [
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

export const myNewCat = cats.find((cat) => catValidator.validate(cat) === true);

log.notice("My new cat is:", myNewCat);
/*
{
	name:  "snowball",
	age:   1,
	paws:  4,
	color: ["white"]
}
*/

export const snowball = catValidator.proxify(myNewCat);

// Let colorize snowball in yellow (don't use toxic products to do so)

try {
	snowball.colors = ["yellow"];
} catch (e) {
	log.error("Can't paint snowball in yellow"); // Throws an error, as i specified that i only want white, black or red cat.
}


// Let's try red ?

snowball.colors = ["red"];

log.notice("snowball's color is now:", snowball.colors); // => ['red']

// oh yeah, a cat from hell !
// let's try making it's paws blue !

try {
	snowball.colors.push("blue"); // Yeah, we also validate incoming data
} catch (e) {
	log.error("Can't paint snowball's paws in blue"); // Throws an error, as i specified that i only want white, black or red cat.
}

// you can now even try by cutting/grafting paws :D

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

log.notice("Snowball's age is:", snowball.age); // => 2
log.notice("Snowball's age is of type:", typeof snowball.age); // => number

export class Cat {}

export const shrodinger = catValidator.proxify(new Cat());

log.notice("Shrodinger constructor is:", shrodinger.constructor.name); // => Cat
log.notice("is Shrodinger instance of cat ?", shrodinger instanceof Cat); // => true

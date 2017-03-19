/* eslint-disable no-console, require-jsdoc, valid-jsdoc */

console.log("#################################");
console.log("#### Functional Example: User ###");
console.log("#################################");

import {Model} from '../lib';

export class User extends Model {
	get fullname () {
		return this.firstname + ' ' + this.lastname;
	}

	get age () {
		const birthdate = this.birth;
		const cur = new Date();
		const diff = cur-birthdate;

		return Math.floor(diff/(1000*60*60*24*365.25));
	}
}

User.register({
	id:        "number",
	username:  "string",
	firstname: "string",
	lastname:  "string",
	birth: 	   "date"
});

export const userDefinition = {
	username:  "JJK801",
	firstname: "Jérémy",
	lastname:  "Jourdin",
	birth:     "1987-01-18"
};

/* Create a new user */

export const userNew = new User(userDefinition);

console.log("New user username is:", userNew.username);
console.log("New user fullname is:", userNew.fullname);
console.log("New user age is:", userNew.age);
console.log("Is new user new ?", User.is(userNew, User.STATE.NEW));
console.log("Is new user modified ?", User.is(userNew, User.STATE.MODIFIED));
console.log("Is new user deleted ?", User.is(userNew, User.STATE.DELETED));

/* Load an existing user */

export const userLoaded = User.load(userDefinition);

console.log("Loaded user username is:", userLoaded.username);
console.log("Loaded user fullname is:", userLoaded.fullname);
console.log("Loaded user age is:", userLoaded.age);
console.log("Is loaded user new ?", User.is(userLoaded, User.STATE.NEW));
console.log("Is loaded user modified ?", User.is(userLoaded, User.STATE.MODIFIED));
console.log("Is loaded user deleted ?", User.is(userLoaded, User.STATE.DELETED));

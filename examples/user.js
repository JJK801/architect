/* eslint-disable no-console, require-jsdoc, valid-jsdoc */

import { Model } from '../lib';
import Log from 'log';

const log = new Log('notice');

log.notice("#################################");
log.notice("#### Functional Example: User ###");
log.notice("#################################");

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

log.notice("New user username is:", userNew.username);
log.notice("New user fullname is:", userNew.fullname);
log.notice("New user age is:", userNew.age);
log.notice("Is new user new ?", User.is(userNew, User.STATE.NEW));
log.notice("Is new user modified ?", User.is(userNew, User.STATE.MODIFIED));
log.notice("Is new user deleted ?", User.is(userNew, User.STATE.DELETED));

/* Load an existing user */

export const userLoaded = User.load(userDefinition);

log.notice("Loaded user username is:", userLoaded.username);
log.notice("Loaded user fullname is:", userLoaded.fullname);
log.notice("Loaded user age is:", userLoaded.age);
log.notice("Is loaded user new ?", User.is(userLoaded, User.STATE.NEW));
log.notice("Is loaded user modified ?", User.is(userLoaded, User.STATE.MODIFIED));
log.notice("Is loaded user deleted ?", User.is(userLoaded, User.STATE.DELETED));

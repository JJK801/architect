/* eslint-disable require-jsdoc, valid-jsdoc */

import Schema from '../../lib/schema';
import Model from '../../lib/model';

class Person extends Model
{
	get fullname () {
		return this.firstname + ' ' + this.lastname;
	}
}

Person.register(() => new Schema({
	id: {
		_type:    "number",
		required: true
	},
	firstname: "string",
	lastname:  "string",
	birth:     "date",
	addresses: {
		_type:   "array",
		items:   [Model.get("Address")],
		default: []
		//unique: 'id'
	},
	profiles: {
		_type:   "array",
		items:   [Model.get("Profile")],
		default: []
		//unique: 'id'
	}
}));

export default Person;

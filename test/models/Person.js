/* eslint-disable require-jsdoc, valid-jsdoc */

import Chance from 'chance';
import { map } from 'lodash';

const chance = new Chance();

import Schema from '../../lib/schema';
import Model, { MetadataManager, RelationManager } from '../../lib/model';

class Person extends Model
{
	get fullname () {
		return this.firstname + ' ' + this.lastname;
	}
}

RelationManager.getRelations(Person)
	.setRelation('addresses')
	.setRelation('profiles', 'person')
	.setRelation('user', 'person');

MetadataManager
	.register(Person, () => new Schema({
		id: {
			_type:    "number",
			required: true
		},
		firstname: "string",
		lastname:  "string",
		birthday:  "date",
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
		},
		user: Model.get("User")
	}));

export default Person;

export function generate (nb) {
	if (nb) {
		return map(Array(nb), () => generate());
	}

	return {
		id: chance.integer({min: 0}),
		firstname: chance.first(),
		lastname: chance.last(),
		birthday: chance.birthday({string: true})
	};
}

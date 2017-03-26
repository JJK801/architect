/* eslint-disable require-jsdoc, valid-jsdoc */

import Chance from 'chance';
import { map } from 'lodash';

const chance = new Chance();

import Schema from '../../lib/schema';
import Model from '../../lib/model';

class Address extends Model
{

}

Address.register(() => new Schema({
	id:        {
		_type:    "number",
		required: true
	},
	number:  "string",
	street:  "string",
	city:    "string",
	zipcode: "string",
	country: "string"
}));


export default Address;

export function generate (nb) {
	if (nb) {
		return map(Array(nb), () => generate());
	}

	return {
		id:      chance.integer({min: 0}),
		number:  chance.integer({min: 0, max: 9999}).toString(),
		street:  chance.street(),
		city:    chance.city(),
		zipcode: chance.zip(),
		country: chance.country()
	};
}

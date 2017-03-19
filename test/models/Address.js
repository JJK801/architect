/* eslint-disable require-jsdoc, valid-jsdoc */

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
	country: "string",
	persons: {
		_type:   "array",
		items:   [Model.get("Person")],
		default: []
		//unique: 'id'
	}
}));

export default Address;

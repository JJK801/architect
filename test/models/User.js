/* eslint-disable require-jsdoc, valid-jsdoc */

import Schema from '../../lib/schema';
import Model from '../../lib/model';

class User extends Model
{

}

User.register(() => new Schema({
	id:     {
		_type:    "number",
		required: true
	},
	username: "string",
	password: "string",
	person:   Model.get("Person")
}));

export default User;

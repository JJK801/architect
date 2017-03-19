/* eslint-disable require-jsdoc, valid-jsdoc */

import Schema from '../../lib/schema';
import Model from '../../lib/model';

class Profile extends Model
{

}

Profile.register(() => new Schema({
	id:     {
		_type:    "number",
		required: true
	},
	person: Model.get("Person")
}));

export default Profile;

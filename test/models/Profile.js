/* eslint-disable require-jsdoc, valid-jsdoc */

import Schema from '../../lib/schema';
import Model, { MetadataManager, RelationManager } from '../../lib/model';

class Profile extends Model
{

}

RelationManager.getRelations(Profile)
	.setRelation('person', 'profiles');

MetadataManager
	.register(Profile, () => new Schema({
		id:     {
			_type:    "number",
			required: true
		},
		person: Model.get("Person")
	}));

export default Profile;

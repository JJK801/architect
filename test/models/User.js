/* eslint-disable require-jsdoc, valid-jsdoc */

import Chance from 'chance';
import { map } from 'lodash';

const chance = new Chance();

import Schema from '../../lib/schema';
import Model, { MetadataManager, RelationManager } from '../../lib/model';

class User extends Model
{

}

RelationManager.getRelations(User)
	.setRelation('person', 'user');

MetadataManager
	.register(User, () => new Schema({
		id:     {
			_type:    'number',
			required: true
		},
		username: 'string',
		person:   Model.get('Person')
	}));

export default User;

export function generate (nb) {
	if (nb) {
		return map(Array(nb), () => generate());
	}

	return {
		id: chance.integer({min: 0}),
		username: chance.email().split('@')[0]
	};
}

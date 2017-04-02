/* eslint-disable require-jsdoc, valid-jsdoc */

import Schema from '../../lib/schema';
import { MetadataManager } from '../../lib/model';

import Profile from './Profile';

class Player extends Profile
{

}

MetadataManager
	.register(Player, () => new Schema({
		number: "number"
	}));

export default Player;

/* eslint-disable require-jsdoc, valid-jsdoc */

import Schema from '../../lib/schema';

import Profile from './Profile';

class Player extends Profile
{

}

Player.register(() => new Schema({
	number: "number"
}));

export default Player;

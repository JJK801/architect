/* eslint-disable valid-jsdoc, require-jsdoc */

import { chunk, slice, sortBy, map, filter } from 'lodash';

const _captures = Symbol('captures');

class Timer
{
	constructor () {
		this[_captures] = [];
	}

	capture () {
		this[_captures].push(new Date().getTime());
	}

	get times () {
		return map(
			sortBy(
				filter(chunk(this[_captures], 2).concat(chunk(slice(this[_captures], 1), 2)), (a) => a.length > 1),
				(timer) => timer[0]
			),
			(timer) => timer[1] - timer[0]
		);
	}
}

export default Timer;

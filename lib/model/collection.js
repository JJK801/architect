import { set, get } from 'lodash';

import Model from './';

const _metadata = Symbol("metadata");

class ModelCollection extends Array {
	constructor () {
		super(...arguments);

		this[_metadata] = {};

		return new Proxy(this, {
			set: (target, key, value) => {
				if (key != "length") {
					if (!(value instanceof Model))
						throw new Error("ModelCollection items must be Model instances.");
				}

				target[key] = value;

				return target;
			}
		});
	}

	static setMetadata (collection, key, value) {
		return set(collection[_metadata], key, value);
	}

	static getMetadata (collection, key) {
		return get(collection[_metadata], key);
	}
}

export default ModelCollection;

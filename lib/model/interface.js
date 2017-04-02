import { EventEmitter } from 'events';
import { assign } from 'lodash';

import Schema from '../schema';

const emitter = new EventEmitter();

/**
 * Interface class for Models
 */
class ModelInterface
{
	/**
	 * @param {object} [data={}] Initialisation data
	 */
	constructor (data = {}) {
		emitter.emit('instanciate.before', this);

		assign(this, data);

		const descriptor = {
			instance: this,
			model:    this.constructor
		};
		-
		emitter.emit('instanciate', descriptor);

		return descriptor.instance;
	}

	/**
	 * Load existing data
	 *
	 * @param {object} [data={}]  Data to load
	 * @param {Model}  [instance] Instance to refresh
	 *
	 * @return {Model} instance with data
	 */
	static load (data = {}, instance) {
		emitter.emit('load', instance, data);

		return instance;
	}

	/**
	 * The static event emitter
	 *
	 * @type {EventEmitter}
	 */
	static get emitter () {
		return emitter;
	}
}

Schema.emitter.on('proxify', (schema, proxy) => {
	const { proxy: obj } = proxy;

	if (obj instanceof ModelInterface) {
		ModelInterface.emitter.emit('proxify', proxy);
	}
});

Schema.emitter.on('change', (obj, key, value) => {
	if (obj instanceof ModelInterface) {
		ModelInterface.emitter.emit('change', obj, key, value);
	}
});

export default ModelInterface;

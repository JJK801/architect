import { EventEmitter } from 'events';

import ObjectSchemaType from './type/object';
import SchemaTypeManager from './type';

import { mapValues, assign, isUndefined, clone, compact } from 'lodash';

const emitter = new EventEmitter();
const _paths  = Symbol('paths');
const _parent = Symbol('parent');

/**
 * Schema class for object validation
 *
 * @extends {ObjectSchemaType}
 */
class Schema extends ObjectSchemaType
{
	/**
	 * @param {object} [map={}] The object keys handled by this schema
	 * @param {object} [descriptor={}] The schema descriptor (in complements of map)
	 */
	constructor (map = {}, descriptor = {}) {
		descriptor.keys = clone(map);

		super(descriptor);

		this[_paths] = mapValues(map, (type) => SchemaTypeManager.instanciate(type));
	}

	/**
	 * @type {SchemaTypeManager}
	 */
	static get TypeManager () {
		return SchemaTypeManager;
	}

	/**
	 * Parent schema
	 *
	 * @type {Schema|undefined}
	 * @param {Schema|undefined} parent Parent schema
	 *
	 * @throws {Error} If parent is not au Schema or undefined
	 */
	set parent (parent) {
		if (!(parent instanceof Schema) && !isUndefined(parent))
			throw new Error("Schema:parent must be an instance of Schema or undefined");

		this[_parent] = parent;
	}

	/**
	 * Parent schema
	 *
	 * @return {Schema|undefined} Parent schema
	 */
	get parent () {
		return this[_parent];
	}

	/**
	 * Paths list of the schema
	 *
	 * @return {object} Paths list
	 */
	get paths () {
		return clone(this[_paths]);
	}

	/**
	 * Profixy an object using [Proxy class]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy}, allow continuous validation
	 *
	 * @param {object} [obj={}] The object to proxify
	 *
	 * @return {object} The proxified object
	 */
	proxify (obj = {}) {
		const listeners = {};

		assign(obj, mapValues(this[_paths], (path, k) => path.cast(obj[k])));

		const handler = {
			set: (target, key, value) => {
				if (this[_paths][key]) {
					value = this[_paths][key].cast(value);

					if (!listeners[key])
						this[_paths][key].on('change', (obj, sk, v) => (obj === target[key]) ? this.emit('change', revocable.proxy, compact([key, sk]), v) : undefined);
				}

				if (value !== target[key]) {
					target[key] = value;

					if (typeof key !== "symbol")
						Schema.emitter.emit('change', revocable.proxy, [key], value);
				}

				return target;
			}
		};

		Schema.emitter.emit('proxify.before', this, handler);

		const revocable = Proxy.revocable(obj, handler);

		Schema.emitter.emit('proxify', this, revocable);

		return revocable.proxy;
	}

	/**
	 * Build the schema validator
	 *
	 * @param {object} [descriptor={}] Descriptor to build
	 *
	 * @return {mixed} validator
	 */
	buildValidator (descriptor = {}) {
		let validator = super.buildValidator(descriptor);
		let parentValidator;

		if (this[_parent])
			parentValidator = this[_parent].buildValidator(descriptor);

		return Schema.adapter.extend(parentValidator, validator);
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

export default Schema;

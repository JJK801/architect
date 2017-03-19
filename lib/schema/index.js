import ObjectSchemaType from './type/object';
import SchemaTypeManager from './type';

import { mapValues, assignWith, isUndefined, clone, isFunction, compact } from 'lodash';

const _paths     = Symbol('paths');
const _parent    = Symbol('parent');

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
	 * @param {object<name, function>} [hooks={}] Communication hooks with proxy
	 *
	 * @return {object} The proxified object
	 */
	proxify (obj = {}, hooks = {}) {
		assignWith(obj, this[_paths], (v, path) => path.cast(v));

		var revocable = Proxy.revocable(obj, {
			set: (target, key, value) => {
				if (this[_paths][key])
					value = this[_paths][key].cast(value, undefined, (k) => hooks.change ? hooks.change(compact([key, k]).join('.')) : undefined );

				if (hooks.change)
					hooks.change(key);

				target[key] = value;

				return target;
			}
		});

		if (isFunction(hooks.revoke))
			hooks.revoke(revocable.revoke);

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
}

export default Schema;

import { isString, isObject, get, compact, find, values, clone, includes, isFunction, assign } from 'lodash';

import Schema from '../schema';

const _models = {};
const _revoke = Symbol("revoke");
const _state  = Symbol("state");

const STATE = {
	"NEW":      1,
	"MODIFIED": 2,
	"DELETED":  4
};

/**
 * Proxify instance with schema
 *
 * @private
 *
 * @return {Model} Proxified instance
 */
function proxify () {
	const hooks = {
		change: (k) => {
			this[_state].flag |= STATE.MODIFIED;

			if (!includes(this[_state].modified, k))
				this[_state].modified.push(k);
		},
		revoke: (revoke) => this[_revoke] = revoke
	};

	return this.constructor.schema.proxify(this, hooks);
}



/**
 * Get a registered model mapping by it name (with namespace), class, or instance
 *
 * @param {Class|Model|string} name The model identifier
 *
 * @return {object|undefined} The model mapping (name, schema, class, namespace) if exists
 */
function mapping (name) {
	let mapping;

	if (name) {
		if (isString(name))
			mapping = get(_models, name);

		if (name instanceof Model)
			mapping = find(values(_models), (def) => name instanceof def.model);

		if (name === Model || name.prototype instanceof Model)
			mapping = find(values(_models), (def) => name === def.model);
	}

	return mapping ? clone(mapping) : mapping;
}

/**
 * Intitialize instance state
 *
 * @return {void}
 */
function initState () {
	this[_state] = {
		flag:     0,
		modified: []
	};
}

/**
 * Base Model class
 */
class Model {
	/**
	 * The class related schema
	 *
	 * @type {Schema}
	 */
	static get schema () {
		return this.metadata.schema();
	}

	/**
	 * The class related namespace
	 *
	 * @type {string}
	 */
	static get namespace () {
		return this.metadata.namespace;
	}

	/**
	 * Get class metadata (schema, constructor, namespace)
	 *
	 * @type {object}
	 */
	static get metadata () {
		const result = mapping(this);

		if (!result)
			this.register();

		return mapping(this);
	}

	/**
	 * List possible states
	 *
	 * @type {object}
	 */
	static get STATE () {
		return clone(STATE);
	}

	/**
	 * List all registered Models
	 *
	 * @type {object}
	 */
	static get List () {
		return clone(_models);
	}

	/**
	 * @param  {object} [data={}] The model initial data
	 */
	constructor (data = {}) {
		initState.call(this);

		this[_state].flag |= STATE.NEW;

		assign(this, data);

		return proxify.call(this);
	}

	/**
	 * Verify instance state
	 *
	 * @param {Model} instance Instance to check
	 * @param {number} mask State bitmask
	 *
	 * @return {boolean} Whether or not the instance match the mask
	 */
	static is (instance, mask) {
		const curFlag = instance[_state].flag;

		return ((curFlag & mask) === mask);
	}

	/**
	 * Get modified fields
	 *
	 * @param {Model} instance The instanceto check
	 *
	 * @return {array<string>|false} Modified fields or false if not modified
	 */
	static modified (instance) {
		return instance[_state].modified.length ? clone(instance[_state].modified) : false;
	}

	/**
	 * Load existing data
	 *
	 * @param {object} [data={}] Data to load
	 * @param {Model} [instance] Instance to refresh
	 *
	 * @return {Model} instance with data
	 */
	static load (data = {}, instance) {
		if (!instance) {
			instance = new this(data);
		} else {
			assign(instance, data);
		}

		initState.call(instance);

		return instance;
	}

	/**
	 * Register a Model with is related Schema
	 *
	 * @param {Schema} [schema=new Schema()] The schema to register for validation
	 * @param {string} [namespace] The namespace of the model (to prevent duplicate name from libs)
	 *
	 * @return {this} The current model
	 */
	static register (schema, namespace) {
		const name = compact([namespace, this.name]).join('/');

		if (_models[name])
			throw new Error("Cannot redeclare model '" + name + "'.");

		let builtSchema;

		_models[name] = {
			name:      name,
			model:     this,
			schema:    () => {
				if (!builtSchema) {
					if (isFunction(schema)) { // Lazy load
						builtSchema = schema();
					} else if (schema instanceof Schema) {
						builtSchema = schema;
					} else if (isObject(schema)) {
						builtSchema = new Schema(schema);
					} else {
						builtSchema = new Schema();
					}

					if ((this.prototype.constructor !== Model) && !builtSchema.parent)
						builtSchema.parent = this.prototype.constructor.schema;
				}

				return builtSchema;
			},
			namespace: namespace
		};

		return this;
	}

	/**
	 * Get a registered model class by it name (with namespace), class, or instance
	 *
	 * @param {Class|Model|string} name The model identifier
	 *
	 * @return {Model|undefined} The model class if exists
	 */
	static get (name) {
		const metadata = mapping(name) || {};

		return metadata.model;
	}
}

export default Model;

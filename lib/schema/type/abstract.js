import Adapter from '../adapter/';
import JoiAdapter from '../adapter/Joi';
import { EventEmitter } from 'events';

const _validator = Symbol('validator');
const _adapter   = Symbol('adapter');

/**
 * Base SchemaType (any)
 *
 * @extends {events.EventEmitter}
 */
class SchemaType extends EventEmitter
{
	/**
	 * The validation adapter
	 *
	 * @type {Adapter}
	 *
	 * @param {Adapter} adapter Validation adapter
	 */
	static set adapter (adapter) {
		if (!(adapter.prototype instanceof Adapter))
			throw new Error('SchemaType:adapter must be a class extending Adapter.');

		this[_adapter] = adapter;
	}

	/**
	 * The validation adapter
	 *
	 * @type {Adapter}
	 */
	static get adapter () {
		return this[_adapter] || JoiAdapter;
	}

	/**
	 * Instance type validator (including base descriptor rules)
	 *
	 * @type {object}
	 */
	get validator () {
		return this[_validator];
	}

	/**
	 * Class type validator
	 *
	 * @type {object}
	 */
	static get validator () {
		return SchemaType.adapter.getValidator(this.typeName);
	}

	/**
	 * Class type name
	 *
	 * @type {string}
	 */
	static get typeName () {
		return 'any';
	}

	/**
	 * @param {object} [descriptor={}] The base validation descriptor
	 */
	constructor (descriptor = {}) {
		super();

		descriptor = SchemaType.adapter.sanitize(this.constructor.typeName, descriptor);

		this[_validator] = this.buildValidator(descriptor);
	}

	/**
	 * Validate a value against te validator
	 *
	 * @param {mixed} val The value to validate
	 * @param {object} [descriptor={}] The descritor to use in extension to the base descriptor
	 *
	 * @return {Error|true} An error if validation failed, true otherwise
	 */
	validate (val, descriptor = {}) {
		return this.buildValidator(descriptor).validate(val).error || true;
	}

	/**
	 * @inheritDoc
	 */
	buildValidator (descriptor = {}) {
		return SchemaType.adapter.build(descriptor, this.validator || this.constructor.validator);
	}

	/**
	 * Cast a value against the descriptor
	 *
	 * @param {mixed} value The value to cast
	 * @param {object} [descriptor={}] The descritor to use in extension to the base descriptor
	 *
	 * @throws {Error} If the validator failed to validate the value (too many "val" in this sentence)
	 *
	 * @return {mixed} The casted value
	 */
	cast (value, descriptor = {}) {
		return SchemaType.adapter.set(value, this.buildValidator(descriptor));
	}
}

export default SchemaType;

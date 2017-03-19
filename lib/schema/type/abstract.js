import Adapter from '../adapter/';
import JoiAdapter from '../adapter/Joi';

const _validator = Symbol('validator');
const _adapter   = Symbol('adapter');

/**
 * Base SchemaType (any)
 */
class SchemaType
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
			throw new Error("SchemaType:adapter must be a class extending Adapter.");

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
		return "any";
	}

	/**
	 * @param {object} [descriptor={}] The base validation descriptor
	 */
	constructor (descriptor = {}) {
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
		const result = this.buildValidator(descriptor).validate(val);

		if (result.error) return result.error;

		return true;
	}

	/**
	 * @inheritDoc
	 */
	buildValidator (descriptor = {}) {
		let validator = this.validator || this.constructor.validator;

		return SchemaType.adapter.build(descriptor, validator);
	}

	/**
	 * Cast a value against the descriptor
	 *
	 * @param {mixed} value The value to cast
	 * @param {object} [descriptor={}] The descritor to use in extension to the base descriptor
	 * @param {function} [notify] Notify function when changes
	 *
	 * @throws {Error} If the validator failed to validate the value (too many "val" in this sentence)
	 *
	 * @return {mixed} The casted value
	 */
	cast (value, descriptor = {}, notify) {
		value = SchemaType.adapter.set(value, this.buildValidator(descriptor));

		if (notify)
			notify(undefined);

		return value;
	}
}

export default SchemaType;

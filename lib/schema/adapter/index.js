/* eslint-disable no-unused-vars */

/**
 * Validation adapter interface (must be overrided by a child class)
 */
class Adapter
{
	/**
	 * Get the validator for a specific type
	 *
	 * @param {string} type The standard type name to validate
	 *
	 * @return {mixed} The validator
	 */
	static getValidator (type) {
		throw new Error('static Adapter:getValidator() method must be overrided by child class');
	}

	/**
	 * Build the validator with a descriptor
	 *
	 * @param {object} [descriptor={}] The validation descriptor
	 * @param {object} validator The base validator to build
	 *
	 * @return {mixed} The builded validator
	 */
	static build (descriptor = {}, validator) {
		throw new Error('static Adapter:build() method must be overrided by child class');
	}

	/**
	 * Validate a value against a validator
	 *
	 * @param {mixed} value The value to validate
	 * @param {object} validator The validator
	 *
	 * @return {Error|true} And Error if validation fails, true otherwise
	 */
	static validate (value, validator) {
		throw new Error('static Adapter:validate() method must be overrided by child class');
	}

	/**
	 * Check/Cast a value before it's set
	 *
	 * @param {mixed} value The value to set
	 * @param {object} validator The validator
	 *
	 * @throws {Error} If validation failed
	 *
	 * @return {mixed} The value if validation succeed
	 */
	static set (value, validator) {
		throw new Error('static Adapter:set() method must be overrided by child class');
	}

	/**
	 * Sanitize a descriptor for a specific type (mainly for sub-validation preparation)
	 *
	 * @param {string} type The standard type to validate
	 * @param {object} [descriptor={}] The validation descriptor
	 *
	 * @return {object} The sanitized descriptor
	 */
	static sanitize (type, descriptor = {}) {
		return descriptor;
	}

	/**
	 * Extend a validator with another
	 *
	 * @param {object} parent The validator to extend
	 * @param {object} child The extension validator
	 *
	 * @return {mixed} The extended validator
	 */
	static extend (parent, child) {
		throw new Error('static Adapter:extend() method must be overrided by child class');
	}
}

export default Adapter;

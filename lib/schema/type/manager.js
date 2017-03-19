import { isString, omit, clone, isObject, isFunction } from 'lodash';

import SchemaType from './abstract';

const _types = {};

/**
 * SchemaType Manager
 */
class SchemaTypeManager
{
	/**
	 * Available Types
	 *
	 * @type {object}
	 */
	static get Types () {
		return clone(_types);
	}

	/**
	 * Register a Type
	 *
	 * @param {SchemaType} schemaType Type to register
	 *
	 * @return {SchemaTypeManager} The SchemaType Manager
	 */
	static register (schemaType) {
		if ((schemaType !== SchemaType) && !(schemaType.prototype instanceof SchemaType))
			throw new Error("SchemaTypeManager:register() Argument#1 must be a SchemaType subclass.");

		_types[schemaType.typeName] = schemaType;

		return this;
	}

	/**
	 * Get a Type by its name
	 *
	 * @param {string} typeName The Type name
	 *
	 * @return {SchemaType|undefined} The Type if exists
	 */
	static get (typeName) {
		return _types[typeName];
	}

	/**
	 * instanciate a type with its descriptor
	 *
	 * @param {object} [descriptor] The Type descriptor
	 *
	 * @return {SchemaType|undefined} The Type if exists
	 */
	static instanciate (descriptor) {
		if (isObject(descriptor)) {
			if (descriptor instanceof SchemaType) {
				return descriptor;
			}

			if (descriptor.prototype instanceof SchemaType) {
				return this.instanciate({
					_type: descriptor
				});
			}

			if (descriptor._type) {
				if (isString(descriptor._type)) {
					descriptor._type = _types[descriptor._type];
				}

				if (descriptor._type instanceof SchemaType) {
					return new Proxy(descriptor._type, {
						get: (target, key) => {

							switch (key) {
								case 'validator':
									return target.buildValidator(omit(descriptor, '_type'));
							}

							return target[key];
						}
					});
				}

				if (descriptor._type.prototype instanceof SchemaType) {
					return new descriptor._type(omit(descriptor, '_type'));
				}

				if (isFunction(descriptor._type)) {
					return this.instanciate({
						_type: "object",
						_instanceOf:  descriptor._type
					});
				}
			} else {
				return this.instanciate({
					_type: descriptor
				});
			}

			return;
		}

		return this.instanciate({
			_type: descriptor
		});
	}
}

export default SchemaTypeManager;

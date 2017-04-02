import Adapter from './index';
import Joi     from 'joi';

import SchemaTypeManager from '../type/manager';

import { map, mapValues, toPairs, isArray, each, invoke } from 'lodash';

/**
 * Validation adapter for [Joi]{@link https://github.com/hapijs/joi}
 *
 * @extends {Adapter}
 */
class JoiAdapter extends Adapter
{
	/**
	 * @inheritdoc
	 */
	static getValidator (type = null) {
		const validator = invoke(Joi, type);

		return validator;
	}

	/**
	 * @inheritdoc
	 */
	static build (descriptor = {}, validator) {
		const methodCalls = toPairs(descriptor);

		each(methodCalls, (call) => {
			const args = isArray(call[1]) && (call[0] !== "default") ? call[1] : [call[1]];

			validator = validator[call[0]].apply(validator, args);
		});

		return validator;
	}

	/**
	 * @inheritdoc
	 */
	static validate (value, validator) {
		return validator.validate(value);
	}

	/**
	 * @inheritdoc
	 */
	static set (value, validator) {
		return Joi.attempt(value, validator);
	}

	/**
	 * @inheritdoc
	 */
	static sanitize (type, descriptor = {}) {
		switch (type) {
			case 'alternatives':
				if (descriptor.try)
					descriptor.try = map(descriptor.try, (type) => SchemaTypeManager.instanciate(type).validator);
				break;
			case 'array':
				if (descriptor.items)
					descriptor.items = map(descriptor.items, (type) => SchemaTypeManager.instanciate(type).validator);
				break;
			case 'object':
				if (descriptor.keys)
					descriptor.keys = mapValues(descriptor.keys, (type) => SchemaTypeManager.instanciate(type).validator);

				if (descriptor._instanceOf) { // @TODO: Manage it a better way
					descriptor.type = descriptor._instanceOf;

					delete descriptor._instanceOf;
				}
				break;
		}

		return super.sanitize(type, descriptor);
	}

	/**
	 * @inheritdoc
	 */
	static extend (parent, child) {
		if (parent)
			return parent.concat(child);

		return child;
	}
}

export default JoiAdapter;

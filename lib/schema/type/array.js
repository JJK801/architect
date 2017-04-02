import { isArray } from 'lodash';

import SchemaType from './abstract';

/**
 * Array SchemaType (array), with validation on insert/delete
 *
 * @extends {SchemaType}
 */
class ArraySchemaType extends SchemaType
{
	/**
	 * @inheritdoc
	 */
	static get typeName () {
		return 'array';
	}

	/**
	 * @inheritdoc
	 */
	cast (value, descriptor = {}) {
		const val = super.cast(value, descriptor);

		if (!isArray(val)) return val;

		const validator = this.buildValidator(descriptor);

		const proxy = new Proxy(val, {
			set: (target, key, value) => {
				if (key != 'length') {
					const testArr = [].concat(target);

					testArr[key] = value;

					value = SchemaType.adapter.set(testArr, validator)[key];

					target[key] = value;

					this.emit('change', proxy, key, value);
				} else {
					target[key] = value;
				}

				return target;
			}
		});

		return proxy;
	}
}

export default ArraySchemaType;

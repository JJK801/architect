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
		return "array";
	}

	/**
	 * @inheritdoc
	 */
	cast (value, descriptor = {}, notify) {
		const val = super.cast(value, notify);

		if (!isArray(val)) return val;

		return new Proxy(val, {
			set: (target, key, value) => {
				const testArr = [].concat(target);

				testArr[key] = value;

				value = SchemaType.adapter.set(testArr, this.validator)[key];

				target[key] = value;

				if (notify)
					notify(undefined);

				return target;
			}
		});
	}
}

export default ArraySchemaType;

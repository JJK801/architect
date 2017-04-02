import SchemaType from './abstract';

/**
 * Number SchemaType (number)
 *
 * @extends {SchemaType}
 */
class NumberSchemaType extends SchemaType
{
	/**
	 * @inheritdoc
	 */
	static get typeName () {
		return 'number';
	}
}

export default NumberSchemaType;

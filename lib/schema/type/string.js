import SchemaType from './abstract';

/**
 * String SchemaType (string)
 *
 * @extends {SchemaType}
 */
class StringSchemaType extends SchemaType
{
	/**
	 * @inheritdoc
	 */
	static get typeName () {
		return "string";
	}
}

export default StringSchemaType;

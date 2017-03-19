import SchemaType from './abstract';

/**
 * Alternative SchemaType (alternatives), allowing to switch between different schema
 *
 * @extends {SchemaType}
 */
class AlternativesSchemaType extends SchemaType
{
	/**
	 * @inheritdoc
	 */
	static get typeName () {
		return "alternatives";
	}
}

export default AlternativesSchemaType;

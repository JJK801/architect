import SchemaType from './abstract';

/**
 * Boolean SchemaType (boolean)
 *
 * @extends {SchemaType}
 */
class BooleanSchemaType extends SchemaType
{
	/**
	 * @inheritdoc
	 */
	static get typeName () {
		return 'boolean';
	}
}

export default BooleanSchemaType;

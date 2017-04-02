import SchemaType from './abstract';

/**
 * Object SchemaType (object)
 *
 * @extends {SchemaType}
 */
class ObjectSchemaType extends SchemaType
{
	/**
	 * @inheritdoc
	 */
	static get typeName () {
		return 'object';
	}
}

export default ObjectSchemaType;

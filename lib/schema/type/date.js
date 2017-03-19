import SchemaType from './abstract';

/**
 * Date SchemaType (date)
 *
 * @extends {SchemaType}
 */
class DateSchemaType extends SchemaType
{
	/**
	 * @inheritdoc
	 */
	static get typeName () {
		return "date";
	}
}

export default DateSchemaType;

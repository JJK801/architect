import SchemaTypeManager      from './manager';
import SchemaType             from './abstract';
import ArraySchemaType 	      from './array';
import BooleanSchemaType      from './boolean';
import DateSchemaType 	      from './date';
import AlternativesSchemaType from './alternatives';
import NumberSchemaType       from './number';
import StringSchemaType       from './string';
import ObjectSchemaType       from './object';

SchemaTypeManager.register(SchemaType);
SchemaTypeManager.register(ArraySchemaType);
SchemaTypeManager.register(BooleanSchemaType);
SchemaTypeManager.register(DateSchemaType);
SchemaTypeManager.register(AlternativesSchemaType);
SchemaTypeManager.register(NumberSchemaType);
SchemaTypeManager.register(StringSchemaType);
SchemaTypeManager.register(ObjectSchemaType);

export default SchemaTypeManager;

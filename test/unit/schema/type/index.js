import { expect } from 'chai';
import test from 'ava';

import SchemaTypeManager from '../../../../lib/schema/type';

import SchemaType from '../../../../lib/schema/type/abstract';
import ArraySchemaType from '../../../../lib/schema/type/array';
import BooleanSchemaType from '../../../../lib/schema/type/boolean';
import DateSchemaType from '../../../../lib/schema/type/date';
import NumberSchemaType from '../../../../lib/schema/type/number';
import AlternativesSchemaType from '../../../../lib/schema/type/alternatives';
import StringSchemaType from '../../../../lib/schema/type/string';

test("Should contain references to basic types", () => {
	expect(SchemaTypeManager.Types.any).to.equal(SchemaType);
	expect(SchemaTypeManager.Types.array).to.equal(ArraySchemaType);
	expect(SchemaTypeManager.Types.boolean).to.equal(BooleanSchemaType);
	expect(SchemaTypeManager.Types.date).to.equal(DateSchemaType);
	expect(SchemaTypeManager.Types.number).to.equal(NumberSchemaType);
	expect(SchemaTypeManager.Types.alternatives).to.equal(AlternativesSchemaType);
	expect(SchemaTypeManager.Types.string).to.equal(StringSchemaType);
});

import { expect } from 'chai';
import test from 'ava';

import SchemaType from '../../../../lib/schema/type/abstract';
import StringType from '../../../../lib/schema/type/string';
import SchemaTypeManager from '../../../../lib/schema/type/manager';

test('Should register valid types only', () => {
	expect(SchemaTypeManager.register(SchemaType)).to.equal(SchemaTypeManager);
	expect(SchemaTypeManager.register(StringType)).to.equal(SchemaTypeManager);
	expect(() => SchemaTypeManager.register({})).to.throw(Error);
	expect(SchemaTypeManager.Types).to.eql({ string: StringType, any: SchemaType });
	expect(SchemaTypeManager.get('string')).to.equal(StringType);
	expect(SchemaTypeManager.get('test')).to.be.undefined;
});

test('Should instanciate valid types', () => {
	const def = {
		_type: new StringType({}),
		required: true
	};

	const type = SchemaTypeManager.instanciate(def);
	const strType = new StringType();

	expect(type).to.be.an.instanceOf(StringType);
	expect(def._type.validate('foo')).to.be.true;
	expect(def._type.validate()).to.be.true;
	expect(type.validate('foo')).to.be.true;
	expect(type.validate()).to.be.an.instanceOf(Error);
	expect(SchemaTypeManager.instanciate('string')).to.be.an.instanceOf(StringType);
	expect(SchemaTypeManager.instanciate(StringType)).to.be.an.instanceOf(StringType);
	expect(SchemaTypeManager.instanciate(strType)).to.be.an.instanceOf(StringType);
	expect(SchemaTypeManager.instanciate(strType)).to.equal(strType);
	expect(SchemaTypeManager.instanciate()).to.be.undefined;
});

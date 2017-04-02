import { expect } from 'chai';
import test from 'ava';

import SchemaType from '../../../../lib/schema/type/abstract';
import NumberSchemaType from '../../../../lib/schema/type/number';

test('Should extends SchemaType', () => expect(NumberSchemaType.prototype).to.be.instanceof(SchemaType));

let emptyDescriptor;
let withMinMax;
let withInteger;

const createEmpty   = () => { emptyDescriptor = new NumberSchemaType(); };
const createMinMax  = () => { withMinMax = new NumberSchemaType({ min: 5, max: 9 }); };
const createInteger = () => { withInteger = new NumberSchemaType({ integer: true }); };

test('Should instanciate without a descriptor', () => expect(createEmpty).to.not.throw());
test('Should instanciate with min/max',         () => expect(createMinMax).to.not.throw());
test('Should instanciate with integer',         () => expect(createInteger).to.not.throw());

test('Should handle no validator correctly', () => {
	expect(emptyDescriptor.validate()).to.be.true;
	expect(emptyDescriptor.validate(false)).to.be.an.instanceof(Error);
	expect(emptyDescriptor.validate(null)).to.be.an.instanceof(Error);
	expect(emptyDescriptor.validate(3)).to.be.true;
	expect(emptyDescriptor.validate(1.234567890)).to.be.true;
	expect(emptyDescriptor.validate('3')).to.be.true;
	expect(emptyDescriptor.validate(Number(3))).to.be.true;
	expect(emptyDescriptor.validate(new Number(3))).to.be.an.instanceof(Error);
});

test('Should handle min/max validator correctly', () => {
	expect(withMinMax.validate()).to.be.true;
	expect(withMinMax.validate(3)).to.be.an.instanceof(Error);
	expect(withMinMax.validate(3.234567890)).to.be.an.instanceof(Error);
	expect(withMinMax.validate(10)).to.be.an.instanceof(Error);
	expect(withMinMax.validate(-Infinity)).to.be.an.instanceof(Error);
	expect(withMinMax.validate(Infinity)).to.be.an.instanceof(Error);
	expect(withMinMax.validate(6)).to.be.true;
	expect(withMinMax.validate(7.234567890)).to.be.true;
});

test('Should handle integer validator correctly', () => {
	expect(withInteger.validate()).to.be.true;
	expect(withInteger.validate(Infinity)).to.be.an.instanceof(Error);
	expect(withInteger.validate(-Infinity)).to.be.an.instanceof(Error);
	expect(withInteger.validate(NaN)).to.be.an.instanceof(Error);
	expect(withInteger.validate(1234567890)).to.be.true;
	expect(withInteger.validate(1.234567890)).to.be.an.instanceof(Error);
});

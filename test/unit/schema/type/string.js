import { expect } from 'chai';
import test from 'ava';

import SchemaType from '../../../../lib/schema/type/abstract';
import StringSchemaType from '../../../../lib/schema/type/string';

test("Should extends SchemaType", () => expect(StringSchemaType.prototype).to.be.instanceof(SchemaType));

let emptyDescriptor;
let withLength;
let withPattern;

const createEmpty   = () => { emptyDescriptor = new StringSchemaType(); };
const createLength  = () => { withLength = new StringSchemaType({ min: 5, max: 9 }); };
const createPattern = () => { withPattern = new StringSchemaType({ regex: /bar$/ }); };

test("Should instanciate without a descriptor", () => expect(createEmpty).to.not.throw());
test("Should instanciate with length",          () => expect(createLength).to.not.throw());
test("Should instanciate with pattern",         () => expect(createPattern).to.not.throw());

test("Should handle no validator correctly", () => {
	expect(emptyDescriptor.validate()).to.be.true;
	expect(emptyDescriptor.validate(false)).to.be.an.instanceof(Error);
	expect(emptyDescriptor.validate(null)).to.be.an.instanceof(Error);
	expect(emptyDescriptor.validate("")).to.be.an.instanceof(Error);
});

test("Should handle length validator correctly", () => {
	expect(withLength.validate()).to.be.true;
	expect(withLength.validate(false)).to.be.an.instanceof(Error);
	expect(withLength.validate(null)).to.be.an.instanceof(Error);
	expect(withLength.validate("")).to.be.an.instanceof(Error);
	expect(withLength.validate("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).to.be.an.instanceof(Error);
	expect(withLength.validate("aaaaaa")).to.be.true;
});

test("Should handle pattern validator correctly", () => {
	expect(withPattern.validate()).to.be.true;
	expect(withPattern.validate(false)).to.be.an.instanceof(Error);
	expect(withPattern.validate(null)).to.be.an.instanceof(Error);
	expect(withPattern.validate("")).to.be.an.instanceof(Error);
	expect(withPattern.validate("foobar")).to.be.true;
	expect(withPattern.validate("barfoo")).to.be.an.instanceof(Error);
});

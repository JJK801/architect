import { expect } from 'chai';
import test from 'ava';

import SchemaType      from '../../../../lib/schema/type/abstract';

let emptyDescriptor;
let withRequired;

const createEmpty     = () => { emptyDescriptor = new SchemaType(); };
const createRequired  = () => { withRequired = new SchemaType({ required: true }); };

test("Should instanciate without a descriptor",  () => expect(createEmpty).to.not.throw());
test("Should instanciate with required",         () => expect(createRequired).to.not.throw());

test("Should handle no validator correctly", () => {
	expect(emptyDescriptor.validate()).to.be.true;
	expect(emptyDescriptor.validate(false)).to.be.true;
	expect(emptyDescriptor.validate(null)).to.be.true;
	expect(emptyDescriptor.validate("")).to.be.true;
});

test("Should not match undefined if required", () => {
	expect(withRequired.validate()).to.an.instanceof(Error);
	expect(withRequired.validate(false)).to.be.true;
	expect(withRequired.validate(null)).to.be.true;
	expect(withRequired.validate("")).to.be.true;
});

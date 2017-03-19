import { expect } from 'chai';
import test from 'ava';

import SchemaType from '../../../../lib/schema/type/abstract';
import DateSchemaType from '../../../../lib/schema/type/date';

test("Should extends SchemaType", () => expect(DateSchemaType.prototype).to.be.instanceof(SchemaType));

let emptyDescriptor;
let afterDescriptor;
let beforeDescriptor;

const createEmpty      = () => { emptyDescriptor  = new DateSchemaType(); };
const createWithAfter  = () => { afterDescriptor   = new DateSchemaType({ min: new Date("2015-01-01") }); };
const createWithBefore = () => { beforeDescriptor = new DateSchemaType({ max: new Date("2015-01-01") }); };

test("Should instanciate without a descriptor", () => expect(createEmpty).to.not.throw());
test("Should instanciate with a after",         () => expect(createWithAfter).to.not.throw());
test("Should instanciate with a before",        () => expect(createWithBefore).to.not.throw());

test("Should handle no validator correctly", () => {
	expect(emptyDescriptor.validate()).to.be.true;
	expect(emptyDescriptor.validate(false)).to.be.an.instanceof(Error);
	expect(emptyDescriptor.validate(null)).to.be.an.instanceof(Error);
	expect(emptyDescriptor.validate("2015-12-01")).to.be.true;
	expect(emptyDescriptor.validate(0)).to.be.true;
	expect(emptyDescriptor.validate(1)).to.be.true;
	expect(emptyDescriptor.validate(new Date("2015-12-01"))).to.be.true;
});

test("Should handle after validator correctly", () => {
	expect(afterDescriptor.validate()).to.be.true;
	expect(afterDescriptor.validate(false)).to.be.an.instanceof(Error);
	expect(afterDescriptor.validate(null)).to.be.an.instanceof(Error);
	expect(afterDescriptor.validate("2015-12-01")).to.be.true;
	expect(afterDescriptor.validate("2014-12-01")).to.be.an.instanceof(Error);
	expect(afterDescriptor.validate(0)).to.be.an.instanceof(Error);
	expect(afterDescriptor.validate(1)).to.be.an.instanceof(Error);
	expect(afterDescriptor.validate(new Date("2015-12-01"))).to.be.true;
	expect(afterDescriptor.validate(new Date("2014-12-01"))).to.be.an.instanceof(Error);
});

test("Should handle before validator correctly", () => {
	expect(beforeDescriptor.validate()).to.be.true;
	expect(beforeDescriptor.validate(false)).to.be.an.instanceof(Error);
	expect(beforeDescriptor.validate(null)).to.be.an.instanceof(Error);
	expect(beforeDescriptor.validate("2014-12-01")).to.be.true;
	expect(beforeDescriptor.validate("2015-12-01")).to.be.an.instanceof(Error);
	expect(beforeDescriptor.validate(0)).to.be.true;
	expect(beforeDescriptor.validate(1)).to.be.true;
	expect(beforeDescriptor.validate(new Date("2014-12-01"))).to.be.true;
	expect(beforeDescriptor.validate(new Date("2015-12-01"))).to.be.an.instanceof(Error);
});

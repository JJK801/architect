import { expect } from 'chai';
import test from 'ava';

import SchemaType from '../../../../lib/schema/type/abstract';
import Type from '../../../../lib/schema/type';

const ArraySchemaType = Type.Types.array;

test("Should extends SchemaType", () => expect(ArraySchemaType.prototype).to.be.instanceof(SchemaType));

let withTypeOf;

const createOf  = () => { withTypeOf = new ArraySchemaType({items: ["string"]}); };

test("Should instanciate with typeOf",          () => expect(createOf).to.not.throw());

test("Should validate typed values", () => {
	expect(withTypeOf.validate([0, undefined, 2])).to.be.an.instanceof(Error);
	expect(withTypeOf.validate(["foo", "bar", undefined])).to.be.an.instanceof(Error);
	expect(withTypeOf.validate(["foo", "bar"])).to.be.true;
});

test("Should proxify content", () => {
	const arr = withTypeOf.cast([]);

	expect(() => arr.push({})).to.throw(Error);
	expect(arr.push("foo")).to.equal(1);
	expect(arr.push("bar")).to.equal(2);
	expect(arr).to.eql(["foo", "bar"]);
});

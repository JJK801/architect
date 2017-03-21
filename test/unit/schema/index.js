import {expect} from 'chai';
import test from 'ava';

import { keys, pick, each } from 'lodash';

import Schema            from '../../../lib/schema';
import SchemaTypeManager from '../../../lib/schema/type';

let schema;
const instanciate = () => {
	schema = new Schema({
		id: {
			_type:     "number",
			required: true
		},
		name: "string",
		birth: {
			_type: "date",
			max:  Date.now()
		},
		active: "boolean",
		tags: {
			_type:  "array",
			items: ["string"]
		}
	});
};
const data = {
	id:     1234,
	name:   "foo",
	birth:  new Date("1987-01-18"),
	active: false,
	tags:   ["bar"],
	custom: 123
};
const dataFalse = {
	id:     undefined,
	name:   null,
	birth:  Date.now()+100000,
	active: null,
	tags:   [undefined]
};

test("Should instanciate without errors", () => expect(instanciate).to.not.throw());

test("Should handle Manager", () => {
	expect(Schema.TypeManager).to.equal(SchemaTypeManager);
});

test("Should validate well formed object", () => {
	const dataKeys = keys(data);

	for (var i = 1; i < dataKeys.length; i++)
		expect(schema.validate(pick(data, dataKeys.slice(0, i)))).to.be.true;
});

test("Should not validate wrong object", () => {
	const dataKeys = keys(dataFalse);

	for (var i = 1; i < dataKeys.length; i++) {
		let result = schema.validate(pick(dataFalse, dataKeys.slice(0, i)));

		expect(result).to.be.instanceof(Error);
		expect(result.name).to.equal("ValidationError");
		expect(result.details.length).to.equal(1);
	}
});

test("Should bind valid data", () => {
	const object = { id: 1 };

	const returned = schema.proxify(object);

	expect(object).to.be.an.instanceof(Proxy);
	expect(object).to.not.equal(returned);
});

test("Should handle parent schema", () => {
	const parent = new Schema({
		foo: 'string'
	});
	const child = new Schema({
		bar: 'number'
	});

	child.parent = parent;

	expect(child.parent).to.equal(parent);
	expect(child.validate({foo: 'bla', bar: 123})).to.be.true;
	expect(child.validate({foo: 'bla', bar: 'bla'})).to.be.an.instanceof(Error);
	expect(child.validate({foo: 123, bar: 123})).to.be.an.instanceof(Error);
	expect(child.validate({foo: 123, bar: 'bla'})).to.be.an.instanceof(Error);
});

test("Should reject bad parent schema", () => {
	const child = new Schema({
		bar: 'number'
	});

	expect(() => child.parent = {}).to.throw(Error);
	expect(() => child.parent = null).to.throw(Error);
	expect(() => child.parent = false).to.throw(Error);
});

test("Should proxify object", () => {
	const object = schema.proxify({ id: 1 });

	each(data, (v, k) => { object[k] = v;});

	expect(object).to.eql(data);
	expect("id" in object).to.be.true;
	expect("custom" in object).to.be.true;
	expect("test" in object).to.be.false;
});

test("Should throw on invalid data", () => {
	const object = schema.proxify({ id: 1 });

	each(dataFalse, (v, k) => expect(() => object[k] = v).to.throw(Error));
});

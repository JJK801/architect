/* eslint-disable require-jsdoc, valid-jsdoc */

import test from 'ava';
import { expect } from 'chai';
import { keys } from 'lodash';

import Model from '../../../lib/model';
import Schema from '../../../lib/schema';

class ModelWithSchema extends Model {}
class ModelWithSchemaData extends Model {}
class ModelWithLazyLoadedSchema extends Model {}
class ModelNotRegistered extends Model {}
class ModelWithNamespace extends Model {}

test("Should register valid models", () => {
	expect(Model.register()).to.equal(Model);
	expect(() => Model.register()).to.throw(Error);

	const schemaData = {
		foo: "string",
		bar: "string"
	};

	const schema = new Schema(schemaData);

	expect(ModelWithSchema.register(schema)).to.equal(ModelWithSchema);
	expect(ModelWithSchemaData.register(schemaData)).to.equal(ModelWithSchemaData);
	expect(ModelWithLazyLoadedSchema.register(() => schema)).to.equal(ModelWithLazyLoadedSchema);

	expect(ModelWithSchema.schema).to.equal(schema);
	expect(ModelWithSchemaData.schema).to.be.an.instanceOf(Schema);
	expect(keys(ModelWithSchemaData.schema.paths)).to.eql(keys(schemaData));
	expect(ModelWithLazyLoadedSchema.schema).to.equal(schema);

	expect(Model.get("ModelNotRegistered")).to.be.undefined;
	expect(ModelNotRegistered.schema).to.be.an.instanceOf(Schema);
	expect(Model.get("ModelNotRegistered")).to.equal(ModelNotRegistered);

	expect(ModelWithNamespace.register(undefined, "ns")).to.equal(ModelWithNamespace);
	expect(Model.get("ns/ModelWithNamespace")).to.equal(ModelWithNamespace);
	expect(ModelWithNamespace.namespace).to.equal("ns");

	expect(keys(Model.List)).to.eql(["Model", "ModelWithSchema", "ModelWithSchemaData", "ModelWithLazyLoadedSchema", "ModelNotRegistered", "ns/ModelWithNamespace"]);
});

test("Should instanciate with the good context", () => {
	const data = { foo: 'bla', bar: 'test' };
	const newModel    = new Model(data);
	const loadedModel = Model.load(data);

	expect(Model.is(newModel, Model.STATE.NEW)).to.be.true;
	expect(Model.is(newModel, Model.STATE.MODIFIED)).to.be.false;
	expect(Model.is(newModel, Model.STATE.DELETED)).to.be.false;

	newModel.foo = 'bar';

	expect(Model.is(newModel, Model.STATE.NEW | Model.STATE.MODIFIED)).to.be.true;
	expect(Model.is(newModel, Model.STATE.DELETED)).to.be.false;
	expect(Model.modified(newModel)).to.eql(["foo"]);

	newModel.foo = 'baz';

	expect(Model.is(newModel, Model.STATE.NEW | Model.STATE.MODIFIED)).to.be.true;
	expect(Model.is(newModel, Model.STATE.DELETED)).to.be.false;
	expect(Model.modified(newModel)).to.eql(["foo"]);

	newModel.test = 'foo';

	expect(Model.is(newModel, Model.STATE.NEW | Model.STATE.MODIFIED)).to.be.true;
	expect(Model.is(newModel, Model.STATE.DELETED)).to.be.false;
	expect(Model.modified(newModel)).to.eql(["foo", "test"]);

	expect(Model.is(loadedModel, Model.STATE.NEW)).to.be.false;
	expect(Model.is(loadedModel, Model.STATE.MODIFIED)).to.be.false;
	expect(Model.is(loadedModel, Model.STATE.DELETED)).to.be.false;

	loadedModel.foo = 'bar';

	expect(Model.is(loadedModel, Model.STATE.NEW)).to.be.false;
	expect(Model.is(loadedModel, Model.STATE.MODIFIED)).to.be.true;
	expect(Model.is(loadedModel, Model.STATE.DELETED)).to.be.false;
	expect(Model.modified(loadedModel)).to.eql(["foo"]);

	loadedModel.foo = 'baz';

	expect(Model.is(loadedModel, Model.STATE.NEW)).to.be.false;
	expect(Model.is(loadedModel, Model.STATE.MODIFIED)).to.be.true;
	expect(Model.is(loadedModel, Model.STATE.DELETED)).to.be.false;
	expect(Model.modified(loadedModel)).to.eql(["foo"]);

	loadedModel.test = 'foo';

	expect(Model.is(loadedModel, Model.STATE.NEW)).to.be.false;
	expect(Model.is(loadedModel, Model.STATE.MODIFIED)).to.be.true;
	expect(Model.is(loadedModel, Model.STATE.DELETED)).to.be.false;
	expect(Model.modified(loadedModel)).to.eql(["foo", "test"]);
});

test("Should get valid models", () => {
	expect(Model.get("Model")).to.equal(Model);
	expect(Model.get(Model)).to.equal(Model);
	expect(Model.get(new Model())).to.equal(Model);
	expect(Model.get()).to.be.undefined;
	expect(Model.get({})).to.be.undefined;
});

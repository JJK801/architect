/* eslint-disable require-jsdoc, valid-jsdoc */

import test from 'ava';
import { expect } from 'chai';
import { keys } from 'lodash';

import MetadataManager from '../../../lib/model/metadata_manager';
import Model from '../../../lib/model';
import Schema from '../../../lib/schema';

class ModelWithSchema extends Model {}
class ModelWithSchemaData extends Model {}
class ModelWithLazyLoadedSchema extends Model {}
class ModelNotRegistered extends Model {}
class ModelWithNamespace extends Model {}

test("Should register valid models", () => {
	expect(MetadataManager.register(Model)).to.be.instanceOf(MetadataManager);

	const schemaData = {
		foo: "string",
		bar: "string"
	};

	const schema = new Schema(schemaData);

	expect(MetadataManager.register(ModelWithSchema, schema)).to.be.instanceOf(MetadataManager);
	expect(MetadataManager.getMetadata(ModelWithSchema).model).to.equal(ModelWithSchema);
	expect(MetadataManager.register(ModelWithSchemaData, schemaData)).to.be.instanceOf(MetadataManager);
	expect(MetadataManager.getMetadata(ModelWithSchemaData).model).to.equal(ModelWithSchemaData);
	expect(MetadataManager.register(ModelWithLazyLoadedSchema, () => schema)).to.be.instanceOf(MetadataManager);
	expect(MetadataManager.getMetadata(ModelWithLazyLoadedSchema).model).to.equal(ModelWithLazyLoadedSchema);

	expect(MetadataManager.getMetadata(ModelWithSchema).schema).to.equal(schema);
	expect(MetadataManager.getMetadata(ModelWithSchemaData).schema).to.be.an.instanceOf(Schema);
	expect(keys(MetadataManager.getMetadata(ModelWithSchemaData).schema.paths)).to.eql(keys(schemaData));
	expect(MetadataManager.getMetadata(ModelWithLazyLoadedSchema).schema).to.equal(schema);

	expect(MetadataManager.getMetadata("ModelNotRegistered")).to.be.undefined;
	expect(MetadataManager.getMetadata(ModelNotRegistered).schema).to.be.an.instanceOf(Schema);
	expect(MetadataManager.getMetadata("ModelNotRegistered").model).to.equal(ModelNotRegistered);

	expect(MetadataManager.register(ModelWithNamespace, undefined, "ns")).to.be.an.instanceOf(MetadataManager);
	expect(MetadataManager.getMetadata("ns/ModelWithNamespace").model).to.equal(ModelWithNamespace);
	expect(MetadataManager.getMetadata(ModelWithNamespace).namespace).to.equal("ns");
});

test("Should get valid models", () => {
	expect(MetadataManager.getMetadata("Model").model).to.equal(Model);
	expect(MetadataManager.getMetadata(Model).model).to.equal(Model);
	expect(MetadataManager.getMetadata(new Model()).model).to.equal(Model);
	expect(MetadataManager.getMetadata()).to.be.undefined;
	expect(MetadataManager.getMetadata({})).to.be.undefined;
});

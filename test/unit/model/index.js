/* eslint-disable require-jsdoc, valid-jsdoc */

import test from 'ava';
import { expect } from 'chai';

import Model, { MetadataManager } from '../../../lib/model';

test('Should get valid models', () => {
	MetadataManager.register(Model);

	expect(Model.get('Model')).to.equal(Model);
	expect(Model.get(Model)).to.equal(Model);
	expect(Model.get(new Model())).to.equal(Model);
	expect(Model.get()).to.be.undefined;
	expect(Model.get({})).to.be.undefined;
});

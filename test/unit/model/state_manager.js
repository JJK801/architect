/* eslint-disable require-jsdoc, valid-jsdoc */

import test from 'ava';
import { expect } from 'chai';

import StateManager from '../../../lib/model/state_manager';
import Model from '../../../lib/model';

test('Should instanciate with the good context', () => {
	const data = { foo: 'bla', bar: 'test' };
	const newModel    = new Model(data);
	const loadedModel = Model.load(data);

	expect(StateManager.getState(newModel).is('NEW')).to.be.true;
	expect(StateManager.getState(newModel).is('MODIFIED')).to.be.false;
	expect(StateManager.getState(newModel).is('DELETED')).to.be.false;

	newModel.foo = 'bar';

	expect(StateManager.getState(newModel).is('NEW|MODIFIED')).to.be.true;
	expect(StateManager.getState(newModel).is('DELETED')).to.be.false;
	//expect(Model.modified(newModel)).to.eql(["foo"]);

	newModel.foo = 'baz';

	expect(StateManager.getState(newModel).is('NEW|MODIFIED')).to.be.true;
	expect(StateManager.getState(newModel).is('DELETED')).to.be.false;
	//expect(Model.modified(newModel)).to.eql(["foo"]);

	newModel.test = 'foo';

	expect(StateManager.getState(newModel).is('NEW|MODIFIED')).to.be.true;
	expect(StateManager.getState(newModel).is('DELETED')).to.be.false;
	//expect(Model.modified(newModel)).to.eql(["foo", "test"]);

	expect(StateManager.getState(loadedModel).is('NEW')).to.be.false;
	expect(StateManager.getState(loadedModel).is('MODIFIED')).to.be.false;
	expect(StateManager.getState(loadedModel).is('DELETED')).to.be.false;

	loadedModel.foo = 'bar';

	expect(StateManager.getState(loadedModel).is('NEW')).to.be.false;
	expect(StateManager.getState(loadedModel).is('MODIFIED')).to.be.true;
	expect(StateManager.getState(loadedModel).is('DELETED')).to.be.false;
	//expect(Model.modified(loadedModel)).to.eql(["foo"]);

	loadedModel.foo = 'baz';

	expect(StateManager.getState(loadedModel).is('NEW')).to.be.false;
	expect(StateManager.getState(loadedModel).is('MODIFIED')).to.be.true;
	expect(StateManager.getState(loadedModel).is('DELETED')).to.be.false;
	//expect(Model.modified(loadedModel)).to.eql(["foo"]);

	loadedModel.test = 'foo';

	expect(StateManager.getState(loadedModel).is('NEW')).to.be.false;
	expect(StateManager.getState(loadedModel).is('MODIFIED')).to.be.true;
	expect(StateManager.getState(loadedModel).is('DELETED')).to.be.false;
	//expect(Model.modified(loadedModel)).to.eql(["foo", "test"]);
});

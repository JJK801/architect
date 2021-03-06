/* eslint-disable no-console, require-jsdoc, valid-jsdoc */

import test from 'ava';
import { expect } from 'chai';
import sinon from 'sinon';

import Log from 'log';

import StateManager from '../../lib/model/state_manager';

const logs = [];

sinon.stub(Log.prototype, 'log', () => logs.push(arguments));

const {User, userNew, userLoaded, userDefinition} = require('../../examples/user');

Log.prototype.log.restore();

test('Should have valid user', () => {
	expect(userNew).to.be.instanceOf(User);
	expect(userNew.username).to.equal(userDefinition.username);
	expect(userNew.firstname).to.equal(userDefinition.firstname);
	expect(userNew.lastname).to.equal(userDefinition.lastname);
	expect(userNew.birth).to.eql(new Date(userDefinition.birth));

	expect(userLoaded).to.be.instanceOf(User);
	expect(userLoaded.username).to.equal(userDefinition.username);
	expect(userLoaded.firstname).to.equal(userDefinition.firstname);
	expect(userLoaded.lastname).to.equal(userDefinition.lastname);
	expect(userLoaded.birth).to.eql(new Date(userDefinition.birth));
});

test('Should expose virtual properties', () => {
	expect(userNew.fullname).to.equal('Jérémy Jourdin');
	expect(userNew.age).to.be.at.least(30);

	expect(userLoaded.fullname).to.equal('Jérémy Jourdin');
	expect(userLoaded.age).to.be.at.least(30);
});

test('Should have the right state', () => {
	expect(StateManager.getState(userNew).is('NEW')).to.be.true;
	expect(StateManager.getState(userNew).is('MODIFIED')).to.be.false;
	expect(StateManager.getState(userNew).is('DELETED')).to.be.false;

	expect(StateManager.getState(userLoaded).is('NEW')).to.be.false;
	expect(StateManager.getState(userLoaded).is('MODIFIED')).to.be.false;
	expect(StateManager.getState(userLoaded).is('DELETED')).to.be.false;
});

/* eslint-disable no-console, require-jsdoc, valid-jsdoc */

import test from 'ava';
import { expect } from 'chai';
import sinon from 'sinon';

import Log from 'log';

const logs = [];

sinon.stub(Log.prototype, 'log', () => logs.push(arguments));

const results = require('../../examples/cat');

Log.prototype.log.restore();

test('Should select the good cat', () => {
	expect(results.myNewCat).to.equal(results.cats[2]);
});

test('Should not paint with bad colors', () => {
	expect(results.snowball).to.eql(results.myNewCat);
	expect(results.snowball.colors).to.eql(['red']);
});

test('Should cast cat age', () => {
	expect(results.snowball.age).to.equal(2);
	expect(typeof results.snowball.age).to.equal('number');
});

test('Should keep identiy once proxified', () => {
	expect(results.shrodinger.constructor).to.equal(results.Cat);
	expect(results.shrodinger instanceof results.Cat).to.be.true;
});

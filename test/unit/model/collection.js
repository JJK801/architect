import { test } from 'ava';
import { expect } from 'chai';

import { isArray } from 'lodash';
import Joi from 'joi';

import Model from '../../../lib/model';
import ModelCollection from '../../../lib/model/collection';

test("Extends array", () => expect(new ModelCollection()).to.be.an.instanceOf(Array));

test("can be used as an array", () => {
	const col = new ModelCollection();
	const ref = [new Model(), new Model(), new Model(), new Model(), new Model()];

	expect(isArray(col)).to.be.true;
	expect(Joi.attempt(col, Joi.array().required().raw(true))).to.equal(col);

	expect(col.length).to.equal(0);

	col.push(ref[0]);
	col.push(ref[1]);
	col.push(ref[2]);
	col.push(ref[3]);

	expect(col.length).to.equal(4);
	expect(col).to.eql(ref.slice(0, 4));

	col.length = 2;

	expect(col.length).to.equal(2);
	expect(col).to.eql(ref.slice(0, 2));

	col[7] = ref[4];

	expect(col.length).to.equal(8);
	expect(col[7]).to.equal(ref[4]);

	expect(() => col.push(3)).to.throw(Error);
});
